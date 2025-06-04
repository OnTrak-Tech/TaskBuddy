import { Amplify } from 'aws-amplify';

// Track if Amplify has been configured
let isConfigured = false;

export function configureAmplify() {
  // Only configure once
  if (isConfigured) return;
  
  // For demo purposes, using hardcoded values
  const config = {
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'eu-west-1_J7EKiwTfA',
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || 'n7u78450uvmbtgjdf6iai58cm',
        identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || 'eu-west-1:85133464-309e-41a4-b886-00d28efcfeab',
        loginWith: {
          username: true,
          email: true,
        }
      }
    },
    API: {
      REST: {
        TaskBuddyAPI: {
          endpoint: import.meta.env.VITE_API_URL || 'https://wd1cddmaod.execute-api.eu-west-1.amazonaws.com',
          region: import.meta.env.VITE_REGION || 'eu-west-1',
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