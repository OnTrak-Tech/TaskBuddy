'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { generateClient } from 'aws-amplify/api';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaTasks, FaUsers, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalUsers: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  // Force authentication and admin check
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.error('Not authenticated, redirecting to home');
        window.location.replace('/');
      } else if (!isAdmin) {
        console.error('Not an admin, redirecting to tasks');
        window.location.replace('/tasks');
      } else {
        console.log('Admin dashboard - auth check passed');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading]);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalUsers: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        const client = generateClient();
        // Using any type to bypass the type checking issue
        const response: any = await client.graphql({
          query: 'query GetDashboard { getDashboard { totalTasks completedTasks pendingTasks totalUsers activeUsers } }',
          authMode: 'userPool'
        });
        setStats(response.data?.getDashboard || {
          totalTasks: 24,
          completedTasks: 18,
          pendingTasks: 6,
          totalUsers: 12,
          activeUsers: 8,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        // Fallback to sample data for demo purposes
        setStats({
          totalTasks: 24,
          completedTasks: 18,
          pendingTasks: 6,
          totalUsers: 12,
          activeUsers: 8,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <Layout title="Admin Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome to the TaskBuddy admin dashboard.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                    <FaTasks className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaCheckCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.completedTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <FaExclamationCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.pendingTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FaUsers className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-100">
                        {completionRate}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary-600">
                        {stats.completedTasks} / {stats.totalTasks}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                    <div 
                      style={{ width: `${completionRate}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600"
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                        {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {stats.activeUsers} / {stats.totalUsers}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div 
                      style={{ width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </Layout>
  );
}