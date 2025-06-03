'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function TasksPage() {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin and redirect if needed
    if (!isLoading && isAuthenticated && isAdmin) {
      console.log('Admin user detected on tasks page - redirecting to admin dashboard');
      router.push('/admin/dashboard');
    }
  }, [isAdmin, isAuthenticated, isLoading, router]);

  // Rest of your component...
  return (
    <div>
      {/* Your tasks page content */}
    </div>
  );
}