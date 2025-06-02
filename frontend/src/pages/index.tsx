import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Authenticator } from '@aws-amplify/ui-react';
import { FaClipboardList, FaArrowRight } from 'react-icons/fa';

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white">
              <FaClipboardList className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="mt-6 text-center text-3xl font-extrabold text-white">TaskBuddy</h1>
            <p className="mt-2 text-center text-sm text-indigo-200">
              Streamlined Task Management for Field Teams
            </p>
          </div>
          
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {redirecting && isAuthenticated ? (
              <div className="text-center p-4">
                <p className="text-indigo-600 mb-4 font-medium">You are signed in! Redirecting to dashboard...</p>
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <Authenticator>
                {({ signOut }) => (
                  <div className="space-y-4">
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            Successfully signed in!
                          </p>
                        </div>
                      </div>
                    </div>
                    
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
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <FaArrowRight className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                      </span>
                      Go to Dashboard
                    </button>
                    
                    <button
                      onClick={signOut}
                      className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </Authenticator>
            )}
          </div>
        </div>
      </div>
      
      <footer className="bg-white bg-opacity-10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-white">
            &copy; {new Date().getFullYear()} TaskBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}