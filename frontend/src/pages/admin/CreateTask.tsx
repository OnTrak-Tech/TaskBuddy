import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useApi } from '../../hooks/useApi'

interface User {
  userId: string
  email: string
  name: string
  role: string
}

const CreateTask = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { callApi } = useApi()
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await callApi<User[]>({ path: '/users' })
        // Filter to only show regular users, not admins
        const regularUsers = data.filter(user => user.role === 'user')
        setUsers(regularUsers)
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }
    
    fetchUsers()
  }, [])
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      await callApi({
        path: '/tasks',
        method: 'POST',
        body: {
          title,
          description,
          priority,
          assignedTo,
          dueDate: dueDate || undefined,
          sendNotification: true // Enable email notification
        }
      })
      navigate('/admin/tasks')
    } catch (err) {
      console.error('Error creating task:', err)
      setError('Failed to create task. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Task</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.userId} value={user.userId}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="button" variant="secondary" className="mr-2" onClick={() => navigate('/admin/tasks')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CreateTask