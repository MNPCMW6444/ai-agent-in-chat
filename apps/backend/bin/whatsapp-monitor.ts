#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WhatsappMonitorStack } from '../lib/whatsapp-monitor-stack';
import { CICDStack } from '../lib/cicd-stack';

const app = new cdk.App();

const env = {
  account: '654654441147',
  region: 'us-east-1',
};

// @ts-ignore
const mainStack = new WhatsappMonitorStack(app, 'WhatsappMonitorStack', {
  env,
  description: 'WhatsApp Monitor application stack',
});

// @ts-ignore
const cicdStack = new CICDStack(app, 'CICDStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-south-1',
  },
  description: 'CI/CD pipeline stack for WhatsApp Monitor',
});

app.synth();
