import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'

const Profile = () => {
  const { user } = useAuth()
  const [userAttributes, setUserAttributes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setUserAttributes(user.attributes || {})
    }
  }, [user])

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <Card className="mb-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Username</h3>
            <p className="mt-1 text-lg">{user?.username || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-lg">{userAttributes.email || 'N/A'}</p>
          </div>
          
          {userAttributes.name && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-lg">{userAttributes.name}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Profile