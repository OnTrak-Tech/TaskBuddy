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
  dueDate: string;
}

export default function TasksPage() {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin and redirect if needed
    if (!isLoading && isAuthenticated && isAdmin) {
      console.log('Admin user detected on tasks page - redirecting to admin dashboard');
      router.push('/admin/dashboard');
    }
  }, [isAdmin, isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Fetch tasks for the user
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
            dueDate: '2023-12-15'
          },
          {
            id: '2',
            title: 'Review code changes',
            description: 'Review pull request #42 with the new features',
            status: 'pending',
            dueDate: '2023-12-10'
          },
          {
            id: '3',
            title: 'Update dependencies',
            description: 'Update all npm packages to their latest versions',
            status: 'completed',
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

    if (isAuthenticated && !isAdmin) {
      fetchTasks();
    }
  }, [isAuthenticated, isAdmin]);

  const updateTaskStatus = (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    // In a real app, you would also call your API to update the task
  };

  if (isLoading || loading) {
    return (
      <Layout title="My Tasks">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Tasks">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-500 mt-1">View and manage your assigned tasks.</p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks assigned to you yet.</p>
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
                    <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
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
                    <select 
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
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