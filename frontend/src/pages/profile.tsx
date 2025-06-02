import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

export default function Profile() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Layout title="Profile | TaskBuddy">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p>{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{user.attributes?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}