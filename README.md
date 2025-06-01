# TaskBuddy - Task Management System

A serverless task management system for field teams with role-based access, real-time notifications, and comprehensive task tracking.

## Architecture

- **Backend**: Java with AWS Lambda
- **Frontend**: NextJS hosted on AWS Amplify
- **Infrastructure**: Provisioned with Terraform
- **Authentication**: Amazon Cognito
- **Database**: Amazon DynamoDB
- **Storage**: Amazon S3
- **Notifications**: Amazon SNS and SES

## Project Structure

```
TaskBuddy/
├── infrastructure/        # Terraform files
├── backend/              # Java Lambda functions
└── frontend/             # NextJS application
```

## Getting Started

1. Set up infrastructure with Terraform
2. Deploy backend Lambda functions
3. Deploy frontend to AWS Amplify

See detailed instructions in each directory's README.