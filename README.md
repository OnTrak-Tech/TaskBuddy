# TaskBuddy

TaskBuddy is a task management application built with React, AWS Amplify, and serverless technologies. It allows administrators to create and assign tasks to users, while users can view and manage their assigned tasks.

## Features

- **User Authentication**: Secure login using Amazon Cognito
- **Role-Based Access Control**: Separate interfaces for admins and regular users
- **Task Management**: Create, assign, update, and track tasks
- **User Management**: Admin interface for creating and managing users
- **Email Notifications**: Automated emails for task assignments and updates

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Authentication**: Amazon Cognito
- **Backend**: AWS Lambda, API Gateway
- **Database**: Amazon DynamoDB
- **Email Service**: Amazon SES

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- AWS account

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/TaskBuddy.git
   cd TaskBuddy
   ```

2. Install dependencies:
   ```
   # For the frontend
   cd frontend
   npm install
   
   # For the new frontend (production version)
   cd ../new-frontend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the `frontend` and `new-frontend` directories
   - Add the required environment variables (see example below)

4. Start the development server:
   ```
   npm run dev
   ```

### Environment Variables

Create a `.env.local` file with the following variables:

```
VITE_AWS_REGION=your-aws-region
VITE_USER_POOL_ID=your-cognito-user-pool-id
VITE_USER_POOL_CLIENT_ID=your-cognito-client-id
VITE_API_ENDPOINT=your-api-gateway-endpoint
VITE_SES_SENDER_EMAIL=your-verified-email
```

### Deployment

#### Frontend Deployment

1. Build the production version:
   ```
   cd new-frontend
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service (Netlify, Vercel, AWS S3, etc.)

## Project Structure

```
TaskBuddy/
├── frontend/             # Development frontend
├── new-frontend/         # Production-ready frontend
├── backend/              # Backend Lambda functions
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/    # Java Lambda functions
│   │   │   └── resources/
│   └── ...
└── README.md
```

## User Roles

- **Admin**: Can create users, create tasks, assign tasks, and manage the system
- **User**: Can view and update their assigned tasks

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- AWS for providing the cloud infrastructure
- React and Vite teams for the excellent frontend tools