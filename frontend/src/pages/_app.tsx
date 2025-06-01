import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/context/AuthContext';

// Configure Amplify
Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_REGION,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    mandatorySignIn: true,
  },
  API: {
    endpoints: [
      {
        name: 'TaskBuddyAPI',
        endpoint: process.env.NEXT_PUBLIC_API_URL,
        region: process.env.NEXT_PUBLIC_REGION,
      },
    ],
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <AuthProvider>
        <Component {...pageProps} />
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </Authenticator.Provider>
  );
}