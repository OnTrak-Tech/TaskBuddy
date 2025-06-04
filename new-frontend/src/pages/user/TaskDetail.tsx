import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaArrowLeft, FaCheck, FaHistory } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  comments: Array<{
    id: string;
    text: string;
    createdAt: string;
    createdBy: {
      id: string;
      name: string;
    };
  }>;
  history: Array<{
    id: string;
    action: string;
    timestamp: string;
    user: {
      id: string;
      name: string;
    };
  }>;
}

const UserTaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        // In a real app, this would fetch from the API
        // const response = await fetch(`/api/tasks/${id}`);
        // const data = await response.json();
        // setTask(data);
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setTask({
            id: id || '1',
            title: 'Fix login bug',
            description: 'Fix the bug in the login form that prevents users from logging in. The issue appears to be related to form validation and error handling.',
            status: 'in-progress',
            priority: 'high',
            dueDate: '2023-04-10T00:00:00Z',
            createdAt: '2023-04-02T14:15:00Z',
            comments: [
              {
                id: '1',
                text: 'I found the issue. It seems to be related to the validation logic.',
                createdAt: '2023-04-03T10:30:00Z',
                createdBy: {
                  id: '1',
                  name: 'John Doe',
                },
              },
              {
                id: '2',
                text: 'Working on a fix now. Should be done by tomorrow.',
                createdAt: '2023-04-04T15:45:00Z',
                createdBy: {
                  id: '1',
                  name: 'John Doe',
                },
              },
            ],
            history: [
              {
                id: '1',
                action: 'Task created',
                timestamp: '2023-04-02T14:15:00Z',
                user: {
                  id: '2',
                  name: 'Admin User',
                },
              },
              {
                id: '2',
                action: 'Task assigned to John Doe',
                timestamp: '2023-04-02T14:16:00Z',
                user: {
                  id: '2',
                  name: 'Admin User',
                },
              },
              {
                id: '3',
                action: 'Status changed from "pending" to "in-progress"',
                timestamp: '2023-04-03T09:30:00Z',
                user: {
                  id: '1',
                  name: 'John Doe',
                },
              },
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error('Failed to load task details');
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      // In a real app, this would call the API
      // await fetch(`/api/tasks/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      // For demo purposes, we'll simulate API call
      if (task) {
        setTask({
          ...task,
          status: newStatus as 'pending' | 'in-progress' | 'completed',
          history: [
            {
              id: (task.history.length + 1).toString(),
              action: `Status changed from "${task.status}" to "${newStatus}"`,
              timestamp: new Date().toISOString(),
              user: {
                id: '1',
                name: 'John Doe',
              },
            },
            ...task.history,
          ],
        });
        toast.success(`Task status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      // In a real app, this would call the API
      // await fetch(`/api/tasks/${id}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: comment })
      // });
      
      // For demo purposes, we'll simulate API call
      if (task) {
        const newComment = {
          id: (task.comments.length + 1).toString(),
          text: comment,
          createdAt: new Date().toISOString(),
          createdBy: {
            id: '1',
            name: 'John Doe',
          },
        };
        
        setTask({
          ...task,
          comments: [...task.comments, newComment],
        });
        setComment('');
        toast.success('Comment added successfully');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Task not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/tasks')}
        >
          <FaArrowLeft className="mr-2" /> Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/tasks')}
        >
          <FaArrowLeft className="mr-2" /> Back to Tasks
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Task Details</h2>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusBadgeClass(task.status)}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{task.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(task.dueDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(task.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-200">
              <div className="flex space-x-2">
                {task.status !== 'completed' && (
                  <Button 
                    variant="primary"
                    onClick={() => handleStatusChange('completed')}
                  >
                    <FaCheck className="mr-2" /> Mark as Completed
                  </Button>
                )}
                {task.status === 'pending' && (
                  <Button 
                    variant="outline"
                    onClick={() => handleStatusChange('in-progress')}
                  >
                    Start Working
                  </Button>
                )}
                {task.status === 'completed' && (
                  <Button 
                    variant="outline"
                    onClick={() => handleStatusChange('in-progress')}
                  >
                    Reopen Task
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <h2 className="text-lg font-medium">Comments</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {task.comments.length === 0 ? (
                  <p className="text-sm text-gray-500">No comments yet</p>
                ) : (
                  task.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-900">{comment.createdBy.name}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(comment.createdAt)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200">
              <form onSubmit={handleAddComment} className="w-full">
                <div className="flex flex-col space-y-2">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button type="submit">
                      Add Comment
                    </Button>
                  </div>
                </div>
              </form>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Task History</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <FaHistory className="mr-2" /> {showHistory ? 'Hide' : 'Show'} History
              </Button>
            </CardHeader>
            {showHistory && (
              <CardContent>
                <div className="space-y-4">
                  {task.history.map((item) => (
                    <div key={item.id} className="border-l-2 border-gray-200 pl-3">
                      <p className="text-sm text-gray-900">{item.action}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{item.user.name}</span>
                        <span>{formatDateTime(item.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserTaskDetail;