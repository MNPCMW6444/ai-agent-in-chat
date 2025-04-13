import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class WhatsappMonitorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table for message storage
    const messagesTable = new dynamodb.Table(this, 'MessagesTable', {
      partitionKey: { name: 'chat_id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Add GSI for user_id
    messagesTable.addGlobalSecondaryIndex({
      indexName: 'UserIndex',
      partitionKey: { name: 'user_id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
    });

    // Create Cognito User Pool with Google OIDC
    const userPool = new cognito.UserPool(this, 'WhatsappUserPool', {
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
      },
    });

    const googleProvider = new cognito.UserPoolIdentityProviderGoogle(
      this,
      'GoogleProvider',
      {
        userPool,
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google OAuth client ID
        clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET', // Replace with your Google OAuth client secret
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
          givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
          familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
        },
      }
    );

    userPool.registerIdentityProvider(googleProvider);

    const userPoolClient = userPool.addClient('WebClient', {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: ['http://localhost:3000/callback'], // Update with your frontend URL
      },
    });

    // Create Lambda functions
    const messageHandler = new lambda.Function(this, 'MessageHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/message-handler'),
      environment: {
        MESSAGES_TABLE: messagesTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    const eventHandler = new lambda.Function(this, 'EventHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/event-handler'),
      environment: {
        MESSAGES_TABLE: messagesTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    const alertHandler = new lambda.Function(this, 'AlertHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/alert-handler'),
      environment: {
        MESSAGES_TABLE: messagesTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    // Grant Lambda functions access to DynamoDB
    messagesTable.grantReadWriteData(messageHandler);
    messagesTable.grantReadWriteData(eventHandler);
    messagesTable.grantReadWriteData(alertHandler);

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'WhatsappApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['*'],
      },
      deployOptions: {
        throttlingRateLimit: 100,
        throttlingBurstLimit: 50,
      },
    });

    // Create authorizer for protected routes
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      'CognitoAuthorizer',
      {
        cognitoUserPools: [userPool],
      }
    );

    // Add webhook endpoints (no auth required)
    const webhookResource = api.root.addResource('webhook');
    webhookResource
      .addResource('m')
      .addMethod('POST', new apigateway.LambdaIntegration(messageHandler));
    webhookResource
      .addResource('ef')
      .addMethod('POST', new apigateway.LambdaIntegration(eventHandler));
    webhookResource
      .addResource('alert')
      .addMethod('POST', new apigateway.LambdaIntegration(alertHandler));

    // Add protected endpoints (require auth)
    const protectedResource = api.root.addResource('protected');
    protectedResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(messageHandler),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      }
    );

    // Output important values
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, 'ApiEndpoint', { value: api.url });
  }
}
