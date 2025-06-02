'use client';

import { useState, useEffect } from 'react';
import { get, put } from 'aws-amplify/api';
import { useAuth } from '@/context/auth-context';
import Layout from '@/components/layout/layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { FaSave, FaUser } from 'react-icons/fa';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  preferredContactMethod?: 'email' | 'phone' | 'both';
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    preferredContactMethod: 'email',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (user) {
          // In a real app, you would fetch this from your API
          const { body } = await get({
            apiName: 'TaskBuddyAPI',
            path: '/profile'
          }).response;
          const response = await body.json();
          setProfile({
            name: response.name || user.attributes?.name || '',
            email: user.attributes?.email || '',
            phone: response.phone || user.attributes?.phone_number || '',
            jobTitle: response.jobTitle || '',
            department: response.department || '',
            preferredContactMethod: response.preferredContactMethod || 'email',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Fallback to user attributes from Cognito
        if (user) {
          setProfile({
            name: user.attributes?.name || '',
            email: user.attributes?.email || '',
            phone: user.attributes?.phone_number || '',
            jobTitle: '',
            department: '',
            preferredContactMethod: 'email',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      // In a real app, you would save this to your API
      await put({
        apiName: 'TaskBuddyAPI',
        path: '/profile',
        options: {
          body: profile
        }
      });
      
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="My Profile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <FaUser className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{profile.name || 'User'}</h2>
                <p className="text-gray-500">{profile.email}</p>
                {profile.jobTitle && (
                  <p className="text-gray-500 mt-1">{profile.jobTitle}</p>
                )}
                {profile.department && (
                  <p className="text-gray-500">{profile.department}</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed. Contact administrator for assistance.</p>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="jobTitle" className="form-label">Job Title</label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={profile.jobTitle || ''}
                      onChange={handleChange}
                      placeholder="Enter your job title"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="department" className="form-label">Department</label>
                    <Input
                      id="department"
                      name="department"
                      value={profile.department || ''}
                      onChange={handleChange}
                      placeholder="Enter your department"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="preferredContactMethod" className="form-label">Preferred Contact Method</label>
                    <select
                      id="preferredContactMethod"
                      name="preferredContactMethod"
                      value={profile.preferredContactMethod}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    isLoading={saving}
                    className="w-full"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
}