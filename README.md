# WhatsApp Monitor Monorepo

This monorepo contains all the components of the WhatsApp Monitor system, organized into separate applications.

## Project Structure

```
whatsapp-monitor/
├── apps/
│   ├── backend/           # AWS CDK Backend Infrastructure
│   │   ├── bin/          # CDK app entry point
│   │   ├── lib/          # CDK stack definitions
│   │   ├── lambda/       # Lambda function code
│   │   └── test/         # Backend tests
│   ├── frontend/         # React Frontend Application
│   └── whatsapp-monitor/ # WhatsApp Web Monitor Script
├── package.json          # Root package.json (workspace config)
└── README.md            # This file
```

## Applications

### Backend (`apps/backend`)

AWS CDK-based serverless infrastructure including:

- Lambda functions
- API Gateway
- DynamoDB
- Cognito authentication
- CloudWatch logging

### Frontend (`apps/frontend`)

React-based web application for:

- User authentication
- Message dashboard
- Real-time chat interface

### WhatsApp Monitor (`apps/whatsapp-monitor`)

Python script for:

- WhatsApp Web monitoring
- Message scraping
- Webhook integration

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Build All Applications**

   ```bash
   npm run build
   ```

3. **Deploy Backend**

   ```bash
   npm run deploy
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

## Development

Each application in the `apps` directory has its own:

- Package.json
- Dependencies
- Build scripts
- Tests

### Backend Development

```bash
cd apps/backend
npm run cdk deploy
```

### Frontend Development

```bash
cd apps/frontend
npm run dev
```

### WhatsApp Monitor Development

```bash
cd apps/whatsapp-monitor
python monitor.py
```

## License

MIT License
