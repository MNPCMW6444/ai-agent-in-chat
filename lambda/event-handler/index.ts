import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDB = new DynamoDB.DocumentClient();
const tableName = process.env.MESSAGES_TABLE!;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const { data } = JSON.parse(event.body);
    const timestamp = new Date().toISOString();
    const chatId = 'default'; // You might want to make this configurable

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: tableName,
      Item: {
        chat_id: chatId,
        timestamp,
        direction: 'incoming',
        message: data,
        user_id: 'system', // For webhook messages
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event stored successfully' }),
    };
  } catch (error) {
    console.error('Error processing event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
