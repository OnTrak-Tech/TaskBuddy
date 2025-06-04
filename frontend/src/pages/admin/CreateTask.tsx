import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
}

const AdminCreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real app, this would fetch from the API
        // const response = await fetch('/api/users');
        // const data = await response.json();
        // setUsers(data);
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setUsers([
            { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
            { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
            { id: '3', name: 'Mike Wilson', email: 'mike.wilson@example.com' },
            { id: '4', name: 'Sarah Johnson', email: 'sarah.johnson@example.com' },
          ]);
        }, 500);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.title || !task.description || !task.assignedTo || !task.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would call the API
      // const response = await fetch('/api/tasks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(task)
      // });
      // const data = await response.json();
      
      // For demo purposes, we'll simulate API call
      setTimeout(() => {
        toast.success('Task created successfully');
        navigate('/admin/tasks');
      }, 1000);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-500 mt-1">Assign a new task to a user.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-lg font-medium">Task Details</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={task.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To <span className="text-red-500">*</span>
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={task.assignedTo}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/tasks')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              Create Task
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminCreateTask;