import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaPlus, FaEdit, FaTrash, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  status: 'CONFIRMED' | 'UNCONFIRMED';
  createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
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
            {
              id: '1',
              username: 'john.doe',
              email: 'john.doe@example.com',
              name: 'John Doe',
              status: 'CONFIRMED',
              createdAt: '2023-01-15T10:30:00Z',
            },
            {
              id: '2',
              username: 'jane.smith',
              email: 'jane.smith@example.com',
              name: 'Jane Smith',
              status: 'CONFIRMED',
              createdAt: '2023-02-20T14:15:00Z',
            },
            {
              id: '3',
              username: 'mike.wilson',
              email: 'mike.wilson@example.com',
              name: 'Mike Wilson',
              status: 'UNCONFIRMED',
              createdAt: '2023-03-05T09:45:00Z',
            },
            {
              id: '4',
              username: 'sarah.johnson',
              email: 'sarah.johnson@example.com',
              name: 'Sarah Johnson',
              status: 'CONFIRMED',
              createdAt: '2023-03-10T16:20:00Z',
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would call the API
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newUser)
      // });
      // const data = await response.json();
      
      // For demo purposes, we'll simulate API call
      setTimeout(() => {
        const newId = (users.length + 1).toString();
        const createdUser = {
          id: newId,
          username: newUser.email.split('@')[0],
          email: newUser.email,
          name: newUser.name,
          status: 'UNCONFIRMED' as const,
          createdAt: new Date().toISOString(),
        };
        
        setUsers([...users, createdUser]);
        setShowCreateModal(false);
        setNewUser({ name: '', email: '' });
        toast.success('User created successfully');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      // In a real app, this would call the API
      // await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      
      // For demo purposes, we'll simulate API call
      setTimeout(() => {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      setLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    try {
      // In a real app, this would call the API
      // await fetch(`/api/users/${userId}/invite`, { method: 'POST' });
      
      // For demo purposes, we'll simulate API call
      toast.info('Sending invitation...');
      setTimeout(() => {
        toast.success('Invitation sent successfully');
      }, 1000);
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage user accounts and permissions.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <FaPlus className="mr-2" /> Add User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'CONFIRMED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={handleSendInvitation}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <FaEnvelope className="inline mr-1" /> Invite
                        </button>
                        <button 
                          onClick={() => toast.info('Edit functionality would open a modal')}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FaEdit className="inline mr-1" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New User</h3>
                    <form onSubmit={handleCreateUser}>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={loading}
                          className="sm:ml-3"
                        >
                          Create User
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateModal(false)}
                          className="mt-3 sm:mt-0"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;