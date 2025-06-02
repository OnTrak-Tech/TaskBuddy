import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

export default function Notifications() {
  const { isAuthenticated } = useAuth();
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
    <Layout title="Notifications | TaskBuddy">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">You have no new notifications.</p>
        </div>
      </div>
    </Layout>
  );
}