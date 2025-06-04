import './globals.css';
import '@aws-amplify/ui-react/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/auth-context';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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