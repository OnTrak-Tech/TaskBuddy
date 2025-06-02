import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

export default function Tasks() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Welcome, {user?.attributes?.email || 'User'}!</p>
          <p className="mt-4">Your task dashboard is being set up.</p>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700">No tasks found. New tasks will appear here.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}