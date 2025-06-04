import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  // Check if user is in the admin group
  const isAdmin = user?.signInUserSession?.accessToken?.payload['cognito:groups']?.includes('admin')
  
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