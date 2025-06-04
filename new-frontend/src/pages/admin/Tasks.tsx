import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const AdminTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // In a real app, this would fetch from the API
        // const response = await fetch('/api/tasks');
        // const data = await response.json();
        // setTasks(data);
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setTasks([
            {
              id: '1',
              title: 'Update user documentation',
              description: 'Update the user documentation with the latest features',
              status: 'completed',
              priority: 'medium',
              dueDate: '2023-04-15T00:00:00Z',
              assignedTo: {
                id: '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
              },
              createdAt: '2023-04-01T10:30:00Z',
            },
            {
              id: '2',
              title: 'Fix login bug',
              description: 'Fix the bug in the login form that prevents users from logging in',
              status: 'in-progress',
              priority: 'high',
              dueDate: '2023-04-10T00:00:00Z',
              assignedTo: {
                id: '2',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
              },
              createdAt: '2023-04-02T14:15:00Z',
            },
            {
              id: '3',
              title: 'Implement search feature',
              description: 'Implement the search feature for the dashboard',
              status: 'pending',
              priority: 'low',
              dueDate: '2023-04-20T00:00:00Z',
              assignedTo: {
                id: '3',
                name: 'Mike Wilson',
                email: 'mike.wilson@example.com',
              },
              createdAt: '2023-04-03T09:45:00Z',
            },
            {
              id: '4',
              title: 'Optimize database queries',
              description: 'Optimize the database queries to improve performance',
              status: 'pending',
              priority: 'medium',
              dueDate: '2023-04-25T00:00:00Z',
              assignedTo: {
                id: '4',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@example.com',
              },
              createdAt: '2023-04-04T16:20:00Z',
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      // In a real app, this would call the API
      // await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      
      // For demo purposes, we'll simulate API call
      setTimeout(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
        toast.success('Task deleted successfully');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-500 mt-1">Manage and assign tasks to users.</p>
        </div>
        <Link to="/admin/tasks/create">
          <Button>
            <FaPlus className="mr-2" /> Create Task
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{task.assignedTo.name}</div>
                        <div className="text-sm text-gray-500">{task.assignedTo.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(task.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => toast.info('View functionality would open a modal')}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <FaEye className="inline mr-1" /> View
                        </button>
                        <button 
                          onClick={() => toast.info('Edit functionality would open a modal')}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FaEdit className="inline mr-1" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTasks;