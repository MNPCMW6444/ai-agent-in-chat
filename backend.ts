import { highOrderHandler } from '@the-libs/express-backend';
import { createRequire } from 'module';
import {
  pushDevice,
  sendPushNotification,
} from '@the-libs/notifications-backend';
const require = createRequire(import.meta.url);
const { Router } = require('express');
import { PushDevice } from '@the-libs/notifications-shared';
import { findDocs, createDoc, getModel } from '@the-libs/mongo-backend';
require('dotenv').config();

const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');

// Setup the AWS Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: 'us-east-1', // Adjust if needed
  credentials: {
    accessKeyId: 'SECRET',
    secretAccessKey: 'SECRET',
  },
});

/**
 * Calls Claude 3 via Bedrock Messages API
 */
export const complete = async ({
  modelId,
  messages,
}: {
  modelId: string;
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
}) => {
  // Extract and merge system prompt into first user message if it exists
  const systemPrompt = messages.find((msg) => msg.role === 'system')?.content;

  const filteredMessages = messages
    .filter((msg) => msg.role !== 'system')
    .map((msg, index) => {
      if (index === 0 && msg.role === 'user' && systemPrompt) {
        return {
          role: msg.role,
          content: `${systemPrompt}\n\n${msg.content}`,
        };
      }
      return msg;
    });

  const input = {
    anthropic_version: 'bedrock-2023-05-31',
    messages: filteredMessages,
    max_tokens: 1000,
    temperature: 0.7,
  };

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(input),
  });

  try {
    const response = await bedrockClient.send(command);
    const decodedBody = new TextDecoder().decode(response.body);
    const json = JSON.parse(decodedBody);
    return json;
  } catch (error) {
    console.error('Bedrock invocation error:', error);
    return null;
  }
};

// 🧪 Test it
const getSummery = async (messagesArr:string[]): Promise<any> => {
  const response = await complete({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content:
          'אני אשמח ממש אם תתן סיכום לכל ההודעות האלה: ' + messagesArr,
      },
    ],
  });

  return response;
};


export const backend = Router();


export const messageModel = () =>
  getModel<any>('message', {
      message: String,
  });

const axios = require('axios');

const BOT_TOKEN = 'SECRET';
const CHANNEL_USERNAME = 'SECRET'; // or channel ID like -1001234567890

async function sendMessage(customMessage?: string) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await axios.post(url, {
      chat_id: CHANNEL_USERNAME,
      text:
          customMessage ??
        ("No data"),
    });
    console.log('Message sent:', res.data);
  } catch (error) {
    console.error(
      'Error sending message:',
      error.response?.data || error.message,
    );
  }
}

backend.post(
  '/registerDevice',
  highOrderHandler(async (req) => {
    const { subscription } = req.body;
    const Push: any = await pushDevice();
    await createDoc<PushDevice>(Push, {
      subscription,
      name:
        'device ' +
        (await findDocs<true, PushDevice>(Push, Push.find())).length,
    });
    return { statusCode: 201 };
  }),
);

backend.post(
  '/log',
  highOrderHandler(async (req) => {
    const Push: any = await messageModel();
    await createDoc<any>(Push, {
      data:
        typeof req?.body?.data === 'string'
          ? req?.body?.data
          : 'error' + Math.random(),
    });
    return { statusCode: 201 };
  }),
);

backend.get( // for deubugging
  '/log',
  highOrderHandler(async (_) => {
    const datas = await (await messageModel()).find({});
    return { statusCode: 201, body: datas.filter(({ data }) => Boolean(data)) };
  }),
);

async function sendToChannel(msg) {
  try {
    const url = `https://api.telegram.org/${"SECRET"}/sendMessage`;
    const res = await axios.post(url, {
      chat_id: "SECRET",
      text: msg,
    });
    console.log('Message sent:', res.data);
  } catch (error) {
    console.error(
      'Error sending message:',
      error.response?.data || error.message,
    );
  }
}

const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);


setInterval(
  async () => {
    const arr = (
      await (await messageModel()).find({ createdAt: { $gte: oneHourAgo } })
    )
      .filter(({ ef }) => Boolean(ef))
      .map(({ ef }) => ef);

    arr2.length > 0 &&
      sendToChannel((await getSummery(arr2.join('\n')))?.content?.[0]?.text ?? 'יש בעיה');
  },
  1000 * 60 * 60,
);

