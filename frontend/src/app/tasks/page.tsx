'use client';

import { useState, useEffect } from 'react';
import { get, put } from 'aws-amplify/api';
import { useAuth } from '@/context/auth-context';
import Layout from '@/components/layout/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { FaCheck, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  assignedTo: string;
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await get({
          apiName: 'TaskBuddyAPI',
          path: '/tasks'
        }).response;
        const data = await response.body.json();
        setTasks(data.tasks || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await put({
        apiName: 'TaskBuddyAPI',
        path: `/tasks/${taskId}/status`,
        options: {
          body: { status: newStatus }
        }
      });
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
      ));
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout title="My Tasks">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <Button>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-500">
                    <FaClock className="mr-2" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                  
                  {task.location && (
                    <div className="flex items-center text-gray-500">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{task.location.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  {task.status === 'PENDING' && (
                    <Button 
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                    >
                      Start Task
                    </Button>
                  )}
                  
                  {task.status === 'IN_PROGRESS' && (
                    <Button 
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                    >
                      <FaCheck className="mr-1" /> Complete
                    </Button>
                  )}
                  
                  {task.status === 'COMPLETED' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      <FaCheck className="mr-1" /> Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}