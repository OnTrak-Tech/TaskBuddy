import { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.attributes?.name || '',
    email: user?.attributes?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would call the API
      // await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: formData.name })
      // });
      
      // For demo purposes, we'll simulate API call
      setTimeout(() => {
        toast.success('Profile updated successfully');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would call the API
      // await fetch('/api/user/password', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: formData.currentPassword,
      //     newPassword: formData.newPassword
      //   })
      // });
      
      // For demo purposes, we'll simulate API call
      setTimeout(() => {
        toast.success('Password changed successfully');
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="flex flex-col items-center py-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <FaUser className="h-12 w-12 text-gray-500" />
              </div>
              <h2 className="text-xl font-medium text-gray-900">{user?.attributes?.name || user?.username}</h2>
              <p className="text-sm text-gray-500">{user?.attributes?.email}</p>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Account Type: <span className="font-medium">{useAuth().isAdmin ? 'Administrator' : 'User'}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-medium">Personal Information</h2>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-300 rounded-md cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-200">
                <Button
                  type="submit"
                  isLoading={loading}
                >
                  Update Profile
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Change Password</h2>
            </CardHeader>
            <form onSubmit={handlePasswordChange}>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-200">
                <Button
                  type="submit"
                  isLoading={loading}
                >
                  Change Password
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;