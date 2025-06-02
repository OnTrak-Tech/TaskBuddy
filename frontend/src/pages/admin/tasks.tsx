import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

export default function AdminTasks() {
  const { isAuthenticated, isAdmin } = useAuth();
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
    <Layout title="Task Management | TaskBuddy">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Task Management</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <p>Create and manage tasks for your team.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create New Task
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Task ID</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Assigned To</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">TASK-001</td>
                  <td className="py-3 px-6">Initial setup</td>
                  <td className="py-3 px-6">admin@example.com</td>
                  <td className="py-3 px-6">
                    <span className="bg-yellow-200 text-yellow-600 py-1 px-3 rounded-full text-xs">In Progress</span>
                  </td>
                  <td className="py-3 px-6">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}