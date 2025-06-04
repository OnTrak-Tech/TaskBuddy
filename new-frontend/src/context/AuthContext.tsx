import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAuthSession, getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface User {
  username: string;
  attributes: {
    email: string;
    name?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isLoading: true,
  signOut: async () => {},
  refreshAuthState: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // For demo purposes - simulate admin check based on email
  const checkIsAdmin = (email: string) => {
    return email.includes('admin');
  };

  const checkUser = async () => {
    try {
      const userInfo = await getCurrentUser();
      const session = await fetchAuthSession();
      
      const currentUser = {
        ...userInfo,
        attributes: {
          email: userInfo.username,
          ...userInfo.signInDetails?.loginId ? { email: userInfo.signInDetails.loginId } : {}
        }
      };
      
      setUser(currentUser);
      setIsAuthenticated(true);
      
      // For demo purposes, check if admin based on email
      const userEmail = currentUser.attributes.email;
      const userIsAdmin = checkIsAdmin(userEmail);
      setIsAdmin(userIsAdmin);
      
      console.log('Auth state updated:', { 
        authenticated: true, 
        isAdmin: userIsAdmin,
        email: userEmail
      });
      
    } catch (error) {
      console.log('Not authenticated');
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const refreshAuthState = async () => {
    setIsLoading(true);
    await checkUser();
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await amplifySignOut();
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, isLoading, signOut, refreshAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};