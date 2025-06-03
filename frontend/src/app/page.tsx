'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { FaClipboardList, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { signInWithRedirect } from 'aws-amplify/auth';

export default function Home() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        if (isAdmin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/tasks');
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAdmin, router, isLoading]);

  const handleSignIn = async () => {
    try {
      router.push('/login');
    } catch (error) {
      console.error('Error navigating to login', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-600 to-secondary-600">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white">
              <FaClipboardList className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="mt-6 text-center text-3xl font-extrabold text-white">TaskBuddy</h1>
            <p className="mt-2 text-center text-sm text-primary-100">
              Streamlined Task Management for Field Teams
            </p>
          </div>
          
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
            {isLoading ? (
              <div className="text-center p-4">
                <p className="text-primary-600 mb-4 font-medium">Loading...</p>
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : redirecting && isAuthenticated ? (
              <div className="text-center p-4">
                <p className="text-primary-600 mb-4 font-medium">You are signed in! Redirecting to dashboard...</p>
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
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
                
                <Button
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
                  className="w-full"
                >
                  <FaArrowRight className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-gray-700 mb-4">
                  Sign in to access your tasks and manage your work.
                </p>
                <Button
                  onClick={handleSignIn}
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
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