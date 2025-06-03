'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  id: string;
  username: string;
  email: string;
}

export default function CreateTaskPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });

  // Force authentication and admin check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        window.location.replace('/');
      } else if (!isAdmin) {
        window.location.replace('/tasks');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API
        // For now, using mock data
        const mockUsers: User[] = [
          {
            id: '1',
            username: 'johndoe',
            email: 'john@example.com'
          },
          {
            id: '2',
            username: 'janedoe',
            email: 'jane@example.com'
          },
          {
            id: '3',
            username: 'bobsmith',
            email: 'bob@example.com'
          }
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, you would call your API to create the task
      console.log('Creating task:', task);
      
      // Redirect to tasks list
      router.push('/admin/tasks');
      
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (isLoading || loading) {
    return (
      <Layout title="Create Task">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Create Task">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-500 mt-1">Assign a new task to a user.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTask}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  value={task.title}
                  onChange={(e) => setTask({...task, title: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  value={task.description}
                  onChange={(e) => setTask({...task, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assign To</label>
                <select
                  id="assignedTo"
                  value={task.assignedTo}
                  onChange={(e) => setTask({...task, assignedTo: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={task.dueDate}
                  onChange={(e) => setTask({...task, dueDate: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={() => router.push('/admin/tasks')}
                className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create Task
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}