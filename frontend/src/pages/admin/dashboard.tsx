import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else if (!isAdmin) {
      router.push('/tasks');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Welcome, Admin {user?.attributes?.email || 'User'}!</p>
          <p className="mt-4">Your admin dashboard is being set up.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="font-bold text-lg mb-2">User Management</h2>
              <p className="text-gray-700">Manage users and permissions</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="font-bold text-lg mb-2">Task Management</h2>
              <p className="text-gray-700">Create and assign tasks</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}