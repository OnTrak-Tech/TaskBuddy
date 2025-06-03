import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

export function configureAmplify() {
  // Configure Auth and API
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'eu-west-1_J7EKiwTfA',
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'n7u78450uvmbtgjdf6iai58cm',
        loginWith: {
          username: true,
          email: true,
        },
        signUpVerificationMethod: 'code',
        oauth: {
          domain: 'taskbuddy-auth-domain.auth.eu-west-1.amazoncognito.com',
          scope: ['email', 'profile', 'openid'],
          redirectSignIn: ['https://main.dhdbdqe5k5n4p.amplifyapp.com/'],
          redirectSignOut: ['https://main.dhdbdqe5k5n4p.amplifyapp.com/'],
          responseType: 'code'
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
  });
}