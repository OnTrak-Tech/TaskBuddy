import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import cognitoAdmin from '../../lib/cognitoAdmin'

const ResetPassword = () => {
  const { username } = useParams<{ username: string }>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const navigate = useNavigate()
  
  const handleResetPassword = async () => {
    if (!username) return
    
    setIsLoading(true)
    setError('')
    setTempPassword('')
    
    try {
      const result = await cognitoAdmin.resetUserPassword(username)
      setTempPassword(result.tempPassword)
    } catch (err) {
      console.error('Error resetting password:', err)
      if (err instanceof Error) {
        setError(`Failed to reset password: ${err.message}`)
      } else {
        setError('Failed to reset password. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reset User Password</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Card>
        <div className="mb-6">
          <p className="text-gray-700">
            You are about to reset the password for user: <strong>{username}</strong>
          </p>
          <p className="text-gray-500 mt-2">
            This will generate a new temporary password that the user will need to change on their next login.
          </p>
        </div>
        
        {tempPassword ? (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <p className="font-bold">Password reset successfully!</p>
              <p className="mt-2">Temporary password: <strong>{tempPassword}</strong></p>
              <p className="text-sm mt-2">Make sure to share this password with the user securely.</p>
            </div>
          </div>
        ) : null}
        
        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          
          {!tempPassword && (
            <Button 
              type="button" 
              onClick={handleResetPassword}
              isLoading={isLoading}
            >
              Reset Password
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default ResetPassword