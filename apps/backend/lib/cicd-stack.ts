import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CICDStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket for artifacts
    const artifactsBucket = new s3.Bucket(this, 'ArtifactsBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create CodeBuild project for backend
    const backendProject = new codebuild.PipelineProject(
      this,
      'BackendProject',
      {
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
          privileged: true,
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              commands: ['cd apps/backend', 'npm install'],
            },
            build: {
              commands: [
                'npm run build',
                'npm run cdk deploy -- --require-approval never',
              ],
            },
          },
          artifacts: {
            files: ['**/*'],
            'base-directory': 'apps/backend',
          },
        }),
      }
    );

    // Create CodeBuild project for frontend
    const frontendProject = new codebuild.PipelineProject(
      this,
      'FrontendProject',
      {
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              commands: ['cd apps/frontend', 'npm install'],
            },
            build: {
              commands: [
                'npm run build',
                'aws s3 sync dist/ s3://${FRONTEND_BUCKET}',
                'aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"',
              ],
            },
          },
          artifacts: {
            files: ['**/*'],
            'base-directory': 'apps/frontend',
          },
        }),
      }
    );

    // Create CodePipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      artifactBucket: artifactsBucket,
    });

    // Add source stage
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'MNPCMW6444',
      repo: 'ai-agent-in-chat',
      oauthToken: cdk.SecretValue.secretsManager('github-token'),
      output: sourceOutput,
      branch: 'main',
    });
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    // Add backend build stage
    const backendOutput = new codepipeline.Artifact();
    const backendAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Backend_Build',
      project: backendProject,
      input: sourceOutput,
      outputs: [backendOutput],
    });
    pipeline.addStage({
      stageName: 'Backend_Build',
      actions: [backendAction],
    });

    // Add frontend build stage
    const frontendOutput = new codepipeline.Artifact();
    const frontendAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Frontend_Build',
      project: frontendProject,
      input: sourceOutput,
      outputs: [frontendOutput],
    });
    pipeline.addStage({
      stageName: 'Frontend_Build',
      actions: [frontendAction],
    });
  }
}
