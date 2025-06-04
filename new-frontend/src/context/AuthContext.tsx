import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  fetchAuthSession,
  getCurrentUser,
  signOut as amplifySignOut,
} from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ==================
// Type Definitions
// ==================
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

const defaultContext: AuthContextType = {
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isLoading: true,
  signOut: async () => {},
  refreshAuthState: async () => {},
};

// ==================
// Context Creation
// ==================
const AuthContext = createContext<AuthContextType>(defaultContext);
export const useAuth = () => useContext(AuthContext);

// ==================
// Provider Component
// ==================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Helper: Admin detection logic (customize as needed)
  const checkIsAdmin = (email: string): boolean => {
    return email.toLowerCase().includes('admin');
  };

  // ==================
  // Fetch Current User
  // ==================
  const checkUser = async () => {
    try {
      const userInfo = await getCurrentUser();
      await fetchAuthSession(); // Required to confirm session validity

      const currentUser: User = {
        username: userInfo.username,
        attributes: {
          email: userInfo.signInDetails?.loginId || userInfo.username,
        },
      };

      const email = currentUser.attributes.email;
      const adminStatus = checkIsAdmin(email);

      setUser(currentUser);
      setIsAdmin(adminStatus);
      setIsAuthenticated(true);

      console.log('✅ Authenticated:', {
        email,
        isAdmin: adminStatus,
      });
    } catch (error) {
      console.log('🚫 Not authenticated:', error);
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial check on mount
  useEffect(() => {
    checkUser();
  }, []);

  // ==================
  // Refresh Auth State
  // ==================
  const refreshAuthState = async () => {
    setIsLoading(true);
    await checkUser();
  };

  // ==================
  // Sign Out
  // ==================
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
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthenticated,
        isLoading,
        signOut,
        refreshAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
