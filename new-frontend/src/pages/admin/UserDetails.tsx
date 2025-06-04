import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useApi } from '../../hooks/useApi'

interface User {
  userId: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: string
  department?: string
  phoneNumber?: string
}

const UserDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { callApi } = useApi()
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await callApi<User>({ 
          path: `/admin/users/${id}`,
          headers: {
            'x-admin-access': 'true'
          }
        })
        setUser(data)
      } catch (err) {
        console.error('Error fetching user details:', err)
        setError('Failed to load user details')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchUser()
    }
  }, [id])
  
  const resetPassword = () => {
    if (user) {
      navigate(`/admin/users/${user.email}/reset-password`)
    }
  }
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading user details...</p>
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
  
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User not found</p>
        <Button onClick={() => navigate('/admin/users')} className="mt-4">
          Back to Users
        </Button>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Button onClick={() => navigate('/admin/users')} variant="secondary">
          Back to Users
        </Button>
      </div>
      
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.role}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div>
              {user.department && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Department</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.department}</dd>
                </div>
              )}
              {user.phoneNumber && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.phoneNumber}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Actions</h3>
            <div className="mt-2 flex space-x-3">
              <Button onClick={resetPassword}>
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default UserDetails