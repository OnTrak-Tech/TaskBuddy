import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminTasks from './pages/admin/Tasks';
import AdminCreateTask from './pages/admin/CreateTask';
import UserDashboard from './pages/user/Dashboard';
import UserTasks from './pages/user/Tasks';
import UserTaskDetail from './pages/user/TaskDetail';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import { configureAmplify } from './lib/amplifyConfig';

function App() {
  useEffect(() => {
    configureAmplify();
  }, []);

  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin" />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="tasks/create" element={<AdminCreateTask />} />
      </Route>
      
      {/* User routes */}
      <Route path="/" element={<ProtectedRoute allowedRole="user" />}>
        <Route index element={<Navigate to="/tasks" replace />} />
        <Route path="tasks" element={<UserTasks />} />
        <Route path="tasks/:id" element={<UserTaskDetail />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;