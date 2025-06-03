'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: {
    id: string;
    username: string;
  };
  dueDate: string;
}

export default function AdminTasksPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API
        // For now, using mock data
        const mockTasks: Task[] = [
          {
            id: '1',
            title: 'Complete project documentation',
            description: 'Write up the final documentation for the project',
            status: 'in_progress',
            assignedTo: {
              id: '1',
              username: 'johndoe'
            },
            dueDate: '2023-12-15'
          },
          {
            id: '2',
            title: 'Review code changes',
            description: 'Review pull request #42 with the new features',
            status: 'pending',
            assignedTo: {
              id: '2',
              username: 'janedoe'
            },
            dueDate: '2023-12-10'
          },
          {
            id: '3',
            title: 'Update dependencies',
            description: 'Update all npm packages to their latest versions',
            status: 'completed',
            assignedTo: {
              id: '3',
              username: 'bobsmith'
            },
            dueDate: '2023-12-05'
          }
        ];
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchTasks();
    }
  }, [isAuthenticated, isAdmin]);

  if (isLoading || loading) {
    return (
      <Layout title="Task Management">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Task Management">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-500 mt-1">View and manage all tasks in the system.</p>
        </div>
        <button
          onClick={() => router.push('/admin/tasks/create')}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Create New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found in the system.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Assigned to:</span> {task.assignedTo.username}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">Due:</span> {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status === 'in_progress' ? 'In Progress' : 
                         task.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button
                      onClick={() => router.push(`/admin/tasks/${task.id}`)}
                      className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Edit
                    </button>
                    <button
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}