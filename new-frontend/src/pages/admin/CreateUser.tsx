import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useApi } from '../../hooks/useApi'
import cognitoAdmin from '../../lib/cognitoAdmin'

const CreateUser = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')
  const [department, setDepartment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const { callApi } = useApi()
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      console.log('Creating user:', { name, email });
      
      // Create user directly in Cognito using our helper
      const result = await cognitoAdmin.createUser({
        username: email,
        email: email,
        name: name
      });
      
      console.log('User created:', result);
      
      setSuccess(`User created successfully! Temporary password: ${result.tempPassword}`);
      
      // Clear form
      setName('')
      setEmail('')
      setRole('user')
      setDepartment('')
      
      // Navigate after a delay to show success message
      setTimeout(() => {
        navigate('/admin/users')
      }, 5000)
    } catch (err) {
      console.error('Error creating user:', err)
      // Show more detailed error if available
      if (err instanceof Error) {
        setError(`Failed to create user: ${err.message}`)
      } else {
        setError('Failed to create user. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create User</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department (Optional)
            </label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          

          
          <div className="flex justify-end">
            <Button type="button" variant="secondary" className="mr-2" onClick={() => navigate('/admin/users')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create User
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CreateUser