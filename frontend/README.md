# TaskBuddy Frontend

This is the frontend application for TaskBuddy, built with React, TypeScript, and AWS Amplify.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file based on `.env.example` and fill in your AWS configuration values.

3. Start the development server:
   ```bash
   npm run dev
   ```

## Build

To build the application for production:

```bash
npm run build
```

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: React context providers
- `src/hooks`: Custom React hooks
- `src/lib`: Configuration and utility libraries
- `src/pages`: Application pages/routes
- `src/utils`: Helper functions

## AWS Integration

This application integrates with AWS services:

- Amazon Cognito for authentication
- API Gateway for backend API access
- AWS Amplify for frontend deployment (optional)

## Deployment

The application can be deployed using AWS Amplify or any static site hosting service.