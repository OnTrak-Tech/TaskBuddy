'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/use-api';
import { FaSave, FaTimes } from 'react-icons/fa';

interface FormData {
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
}

export default function CreateTaskPage() {
  const router = useRouter();
  const { loading, apiPost } = useApi();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    location: {
      address: ''
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'address') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          address: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assigned user is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await apiPost('/admin/tasks', formData, {
      showSuccessToast: true,
      showErrorToast: true,
      successMessage: 'Task created successfully!'
    });
    
    if (result) {
      router.push('/admin/tasks');
    }
  };

  return (
    <Layout title="Create Task">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-500 mt-1">Fill in the details to create a new task.</p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                error={errors.title}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                className={`flex w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]`}
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">Due Date</label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                error={errors.dueDate}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="assignedTo" className="form-label">Assign To</label>
              <Input
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Enter user ID or email"
                error={errors.assignedTo}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address" className="form-label">Location (Optional)</label>
              <Input
                id="address"
                name="address"
                value={formData.location?.address || ''}
                onChange={handleChange}
                placeholder="Enter location address"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/tasks')}
            >
              <FaTimes className="mr-2" /> Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              <FaSave className="mr-2" /> Create Task
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Layout>
  );
}