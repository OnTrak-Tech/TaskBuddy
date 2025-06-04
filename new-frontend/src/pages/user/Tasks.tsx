import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaFilter, FaSort, FaEye, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

const UserTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // In a real app, this would fetch from the API
        // const response = await fetch('/api/user/tasks');
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
              createdAt: '2023-04-01T10:30:00Z',
            },
            {
              id: '2',
              title: 'Fix login bug',
              description: 'Fix the bug in the login form that prevents users from logging in',
              status: 'in-progress',
              priority: 'high',
              dueDate: '2023-04-10T00:00:00Z',
              createdAt: '2023-04-02T14:15:00Z',
            },
            {
              id: '3',
              title: 'Implement search feature',
              description: 'Implement the search feature for the dashboard',
              status: 'pending',
              priority: 'low',
              dueDate: '2023-04-20T00:00:00Z',
              createdAt: '2023-04-03T09:45:00Z',
            },
            {
              id: '4',
              title: 'Optimize database queries',
              description: 'Optimize the database queries to improve performance',
              status: 'pending',
              priority: 'medium',
              dueDate: '2023-04-25T00:00:00Z',
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

  const handleMarkAsCompleted = async (taskId: string) => {
    try {
      // In a real app, this would call the API
      // await fetch(`/api/tasks/${taskId}/complete`, { method: 'PUT' });
      
      // For demo purposes, we'll simulate API call
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: 'completed' as const } : task
      ));
      toast.success('Task marked as completed');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
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

  // Filter tasks based on status
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  // Sort tasks based on selected criteria
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-500 mt-1">View and manage your assigned tasks.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-700">
            <FaFilter className="inline mr-1" /> Filter:
          </span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-700">
            <FaSort className="inline mr-1" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="createdAt">Creation Date</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : sortedTasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No tasks found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.map((task) => (
            <Card key={task.id} className="flex flex-col">
              <CardHeader className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500 mb-4">{task.description}</p>
                <div className="text-sm text-gray-500">
                  <p><strong>Due Date:</strong> {formatDate(task.dueDate)}</p>
                  <p><strong>Created:</strong> {formatDate(task.createdAt)}</p>
                </div>
              </CardContent>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <Link to={`/tasks/${task.id}`}>
                  <Button variant="outline" size="sm">
                    <FaEye className="mr-1" /> View Details
                  </Button>
                </Link>
                {task.status !== 'completed' && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleMarkAsCompleted(task.id)}
                  >
                    <FaCheck className="mr-1" /> Mark Complete
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTasks;