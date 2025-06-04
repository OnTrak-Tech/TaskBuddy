# TaskBuddy Frontend

A React-based task management application with role-based authentication (Admin/User) that integrates with AWS Cognito and Lambda backend functions.

## Features

- Authentication System with AWS Cognito
- Role-based Access Control (Admin/User)
- Admin Dashboard with user and task management
- User Dashboard with personal task management
- Responsive design for all devices

## Tech Stack

- React 18+ with TypeScript
- Vite for fast development
- React Router for navigation
- AWS Amplify for Cognito integration
- Tailwind CSS for styling
- React Toastify for notifications
- React Icons for UI icons

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd new-frontend
npm install
```

3. Create a `.env.local` file based on `.env.example` and fill in your AWS credentials

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: React context providers
- `src/hooks`: Custom React hooks
- `src/pages`: Application pages
- `src/lib`: Utility functions and configurations
- `src/utils`: Helper functions

## Deployment

This application is designed to be deployed on AWS Amplify. Follow these steps:

1. Push your code to a Git repository
2. Set up an Amplify project in the AWS Console
3. Connect your repository to Amplify
4. Configure build settings and environment variables
5. Deploy

## License

This project is licensed under the MIT License.