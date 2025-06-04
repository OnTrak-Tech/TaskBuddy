import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useApi } from '../../hooks/useApi'

interface Task {
  taskId: string
  title: string
  description?: string
  status: string
  priority: string
  createdAt: string
  assignedBy?: string
  dueDate?: string
}

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const { callApi } = useApi()
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await callApi<Task>({ path: `/tasks/${id}` })
        setTask(data)
      } catch (err) {
        console.error('Error fetching task details:', err)
        setError('Failed to load task details')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchTask()
    }
  }, [id])
  
  const updateTaskStatus = async (newStatus: string) => {
    if (!task) return
    
    setUpdating(true)
    try {
      const updatedTask = await callApi<Task>({
        path: `/tasks/${id}/status`,
        method: 'PUT',
        body: { status: newStatus }
      })
      setTask(updatedTask)
    } catch (err) {
      console.error('Error updating task status:', err)
      setError('Failed to update task status')
    } finally {
      setUpdating(false)
    }
  }
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading task details...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }
  
  if (!task) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Task not found</p>
        <Button onClick={() => navigate('/tasks')} className="mt-4">
          Back to Tasks
        </Button>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <Button onClick={() => navigate('/tasks')} variant="secondary">
          Back to Tasks
        </Button>
      </div>
      
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Task Details</h3>
            <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {task.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Priority</dt>
                <dd className="mt-1 text-sm text-gray-900">{task.priority}</dd>
              </div>
              {task.dueDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(task.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <div className="mt-2 prose prose-sm text-gray-500">
              {task.description || 'No description provided'}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Actions</h3>
            <div className="mt-2 flex space-x-3">
              {task.status === 'pending' && (
                <Button 
                  onClick={() => updateTaskStatus('in_progress')} 
                  isLoading={updating}
                  disabled={updating}
                >
                  Start Task
                </Button>
              )}
              
              {task.status === 'in_progress' && (
                <Button 
                  onClick={() => updateTaskStatus('completed')} 
                  isLoading={updating}
                  disabled={updating}
                >
                  Complete Task
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TaskDetail