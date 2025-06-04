'use client';

import { useRouter } from 'next/navigation';
import { FaClipboardList } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
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