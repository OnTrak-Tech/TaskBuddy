'use client';

import './globals.css';
import '@aws-amplify/ui-react/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { Authenticator } from '@aws-amplify/ui-react';
import { AuthProvider } from '@/context/auth-context';
import { useEffect } from 'react';
import { configureAmplify } from '@/lib/amplify-config';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Configure Amplify on client-side
  useEffect(() => {
    configureAmplify();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ToastContainer position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}