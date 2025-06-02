# TaskBuddy Frontend

A modern Next.js frontend for the TaskBuddy application.

## Features

- Built with Next.js 14 and React 18
- TypeScript for type safety
- Tailwind CSS for styling
- AWS Amplify for authentication and API integration
- Responsive design for mobile and desktop
- Component-based architecture

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd TaskBuddy/frontend-new
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_REGION=eu-west-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-west-1_J7EKiwTfA
NEXT_PUBLIC_COGNITO_CLIENT_ID=n7u78450uvmbtgjdf6iai58cm
NEXT_PUBLIC_API_URL=https://uzoqf3buyb.execute-api.eu-west-1.amazonaws.com/Prod
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

- `src/app`: App router pages and layouts
- `src/components`: Reusable UI components
  - `src/components/ui`: Basic UI components
  - `src/components/layout`: Layout components
- `src/context`: React context providers
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and configurations
- `public`: Static assets

## Authentication

Authentication is handled through AWS Cognito using the AWS Amplify library. The `AuthProvider` context manages the authentication state and provides user information to the application.

## API Integration

API calls are made using the AWS Amplify API module. A custom `useApi` hook is provided for simplified API interactions with loading and error states.

## Styling

The application uses Tailwind CSS for styling with a custom theme defined in `tailwind.config.js`. Additional global styles are defined in `src/app/globals.css`.

## Deployment

The frontend can be deployed using AWS Amplify Hosting or any other static site hosting service that supports Next.js applications.