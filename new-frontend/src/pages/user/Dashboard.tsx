import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'

interface TaskStats {
  total: number
  completed: number
  inProgress: number
  pending: number
}

const UserDashboard = () => {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { callApi } = useApi()
  const { user } = useAuth()
  
  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const data = await callApi<TaskStats>({ 
          path: '/tasks/stats',
          headers: {
            'x-user-id': user?.username || ''
          }
        })
        setStats(data)
      } catch (err) {
        console.error('Error fetching task stats:', err)
        setError('Failed to load task statistics')
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchTaskStats()
    }
  }, [user])
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Tasks">
          <div className="text-3xl font-bold">{stats.total}</div>
          <p className="text-gray-500">Assigned to you</p>
        </Card>
        
        <Card title="Pending">
          <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
          <p className="text-gray-500">Not started</p>
        </Card>
        
        <Card title="In Progress">
          <div className="text-3xl font-bold text-blue-500">{stats.inProgress}</div>
          <p className="text-gray-500">Currently working</p>
        </Card>
        
        <Card title="Completed">
          <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
          <p className="text-gray-500">Finished tasks</p>
        </Card>
      </div>
      
      <div className="mt-8">
        <Link 
          to="/tasks" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View all my tasks →
        </Link>
      </div>
    </div>
  )
}

export default UserDashboard