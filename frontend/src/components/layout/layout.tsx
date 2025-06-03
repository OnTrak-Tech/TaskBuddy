'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import Sidebar from './sidebar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'TaskBuddy' }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  if (!hasMounted) return null; // Prevent hydration mismatch

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only check authentication for non-login pages
  if (!isAuthenticated && !window.location.pathname.includes('/login')) {
    console.log('User not authenticated, redirecting to login');
    window.location.replace('/');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:pl-64">
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
