import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Auth } from 'aws-amplify'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  signIn: (username: string, password: string) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    checkAuthState()
  }, [])

  async function checkAuthState() {
    try {
      const currentUser = await Auth.currentAuthenticatedUser()
      
      // Get the current session to ensure we have the latest token
      const session = await Auth.currentSession();
      currentUser.signInUserSession = session;
      
      console.log('Auth state checked:', currentUser.username);
      console.log('User groups:', currentUser.signInUserSession?.accessToken?.payload['cognito:groups']);
      console.log('User email:', currentUser.attributes?.email);
      
      setUser(currentUser)
      setIsAuthenticated(true)
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  async function signIn(username: string, password: string) {
    try {
      const user = await Auth.signIn(username, password)
      setUser(user)
      setIsAuthenticated(true)
      return user
    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    try {
      await Auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}