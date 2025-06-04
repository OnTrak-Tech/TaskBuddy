import { Amplify } from 'aws-amplify';

// Track if Amplify has been configured
let isConfigured = false;

export function configureAmplify() {
  // Only configure once
  if (isConfigured) return;
  
  const config = {
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_example',
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || 'example-client-id',
        identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
        loginWith: {
          username: true,
          email: true,
        }
      }
    },
    API: {
      REST: {
        TaskBuddyAPI: {
          endpoint: import.meta.env.VITE_API_URL || 'https://api.example.com',
          region: import.meta.env.VITE_REGION || 'us-east-1',
        }
      }
    }
  };
  
  try {
    Amplify.configure(config);
    isConfigured = true;
    console.log('Amplify configured successfully');
  } catch (error) {
    console.error('Error configuring Amplify:', error);
  }
}