import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

// Track if Amplify has been configured
let isConfigured = false;

export function configureAmplify() {
  // Only configure once
  if (isConfigured) return;
  
  const config = {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'eu-west-1_J7EKiwTfA',
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'n7u78450uvmbtgjdf6iai58cm',
        identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || 'eu-west-1:85133464-309e-41a4-b886-00d28efcfeab',
        loginWith: {
          username: true,
          email: true,
        }
      }
    },
    API: {
      REST: {
        TaskBuddyAPI: {
          endpoint: process.env.NEXT_PUBLIC_API_URL || 'https://uzoqf3buyb.execute-api.eu-west-1.amazonaws.com/Prod',
          region: process.env.NEXT_PUBLIC_REGION || 'eu-west-1',
        }
      }
    }
  };
  
  try {
    Amplify.configure(config);
    console.log('Amplify configured successfully');
    isConfigured = true;
  } catch (error) {
    console.error('Error configuring Amplify:', error);
  }
}
