import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Authenticator } from '@aws-amplify/ui-react';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setRedirecting(true);
      setTimeout(() => {
        if (isAdmin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/tasks');
        }
      }, 500);
    }
  }, [isAuthenticated, isAdmin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">TaskBuddy</h1>
        <p className="text-gray-600 text-center mb-8">
          Task Management System for Field Teams
        </p>
        {redirecting && isAuthenticated ? (
          <div className="text-center p-4">
            <p className="text-green-600 mb-4">You are signed in! Redirecting to dashboard...</p>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <Authenticator>
            {({ signOut }) => (
              <div className="text-center">
                <p className="text-green-600 mb-4">You are signed in!</p>
                <button
                  onClick={() => {
                    setRedirecting(true);
                    setTimeout(() => {
                      if (isAdmin) {
                        router.push('/admin/dashboard');
                      } else {
                        router.push('/tasks');
                      }
                    }, 500);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-3 w-full"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
                >
                  Sign Out
                </button>
              </div>
            )}
          </Authenticator>
        )}
      </div>
    </div>
  );
}