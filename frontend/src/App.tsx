import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'

// Pages
import Login from './pages/Login'
import Profile from './pages/Profile'
import Dashboard from './pages/admin/Dashboard'
import Tasks from './pages/admin/Tasks'
import Users from './pages/admin/Users'
import CreateTask from './pages/admin/CreateTask'
import CreateUser from './pages/admin/CreateUser'
import UserDetails from './pages/admin/UserDetails'
import ResetPassword from './pages/admin/ResetPassword'
import UserTasks from './pages/user/Tasks'
import TaskDetail from './pages/user/TaskDetail'

// Import NotFound directly here to avoid path resolution issues
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
    <p className="text-xl text-gray-600 mb-8">Page not found</p>
    <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Return to Dashboard
    </a>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Admin routes */}
            <Route path="/admin/tasks" element={<Tasks />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/tasks/create" element={<CreateTask />} />
            <Route path="/admin/users/create" element={<CreateUser />} />
            <Route path="/admin/users/:id" element={<UserDetails />} />
            <Route path="/admin/users/:username/reset-password" element={<ResetPassword />} />
            
            {/* User routes */}
            <Route path="/tasks" element={<UserTasks />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App