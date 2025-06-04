import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { FaTasks, FaUsers, FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalUsers: number;
  activeUsers: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalUsers: 0,
    activeUsers: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would fetch from the API
        // const response = await fetch('/api/dashboard/stats');
        // const data = await response.json();
        // setStats(data);
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setStats({
            totalTasks: 24,
            completedTasks: 18,
            pendingTasks: 6,
            totalUsers: 12,
            activeUsers: 8,
            recentActivity: [
              { 
                id: '1', 
                type: 'task_completed', 
                description: 'John completed "Update user documentation"', 
                timestamp: new Date(Date.now() - 3600000).toISOString() 
              },
              { 
                id: '2', 
                type: 'task_assigned', 
                description: 'New task "Fix login bug" assigned to Sarah', 
                timestamp: new Date(Date.now() - 7200000).toISOString() 
              },
              { 
                id: '3', 
                type: 'user_added', 
                description: 'New user Michael added to the system', 
                timestamp: new Date(Date.now() - 86400000).toISOString() 
              },
              { 
                id: '4', 
                type: 'task_updated', 
                description: 'Task "Implement search feature" updated by Admin', 
                timestamp: new Date(Date.now() - 172800000).toISOString() 
              },
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome to the TaskBuddy admin dashboard.</p>
      </div>

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
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
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
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Task Completion Rate</h3>
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
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <FaClock className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;