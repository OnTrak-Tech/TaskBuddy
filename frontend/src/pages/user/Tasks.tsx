import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'

interface Task {
  taskId: string
  title: string
  status: string
  priority: string
  createdAt: string
  description?: string
  assignedTo?: string
}

const UserTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { callApi } = useApi()
  const { user } = useAuth()
  
  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const data = await callApi<Task[]>({ 
          path: '/tasks/assigned',
          headers: {
            'x-user-id': user?.username || ''
          }
        })
        setTasks(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching tasks:', err)
        setError('Failed to load your tasks')
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchUserTasks()
    }
  }, [user])
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.taskId}>
                    <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.priority}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/tasks/${task.taskId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks assigned to you</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default UserTasks