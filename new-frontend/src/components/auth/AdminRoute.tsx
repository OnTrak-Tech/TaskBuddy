import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  // Check if user is in the admin group or has admin email
  const groups = user?.signInUserSession?.accessToken?.payload['cognito:groups'] || [];
  const isAdminByGroup = Array.isArray(groups) && groups.includes('admin');
  const isAdminByEmail = user?.attributes?.email === 'kwesijay8@gmail.com';
  const isAdmin = isAdminByGroup || isAdminByEmail;
  
  // Debug information
  console.log('User:', user?.username);
  console.log('Groups:', groups);
  console.log('Is admin by group:', isAdminByGroup);
  console.log('Is admin by email:', isAdminByEmail);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <Outlet />
}

export default AdminRoute