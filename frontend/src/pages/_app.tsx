import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/context/AuthContext';
import Head from 'next/head';

// Configure Amplify
Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_REGION || 'eu-west-1',
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'eu-west-1_J7EKiwTfA',
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'n7u78450uvmbtgjdf6iai58cm',
    mandatorySignIn: true,
  },
  API: {
    endpoints: [
      {
        name: 'TaskBuddyAPI',
        endpoint: process.env.NEXT_PUBLIC_API_URL || 'https://uzoqf3buyb.execute-api.eu-west-1.amazonaws.com/Prod',
        region: process.env.NEXT_PUBLIC_REGION || 'eu-west-1',
      },
    ],
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <AuthProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="./styles.css" />
        </Head>
        <Component {...pageProps} />
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </Authenticator.Provider>
  );
}