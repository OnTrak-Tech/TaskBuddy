'use client';

import './globals.css';
import '@aws-amplify/ui-react/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { configureAmplify } from '@/lib/amplify-config';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAmplifyConfigured, setIsAmplifyConfigured] = useState(false);

  // Configure Amplify on client-side
  useEffect(() => {
    try {
      configureAmplify();
      setIsAmplifyConfigured(true);
    } catch (error) {
      console.error('Failed to configure Amplify:', error);
    }
  }, []);

  if (!isAmplifyConfigured) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </body>
      </html>
    );
  }

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