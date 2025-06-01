import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface AuthContextType {
  user: any;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { authStatus, signOut } = useAuthenticator((context) => [context.authStatus]);
  const isAuthenticated = authStatus === 'authenticated';

  useEffect(() => {
    const checkUser = async () => {
      if (isAuthenticated) {
        try {
          const currentUser = await Auth.currentAuthenticatedUser();
          setUser(currentUser);
          
          // Check if user is admin
          const groups = currentUser.signInUserSession.accessToken.payload['cognito:groups'] || [];
          setIsAdmin(groups.includes('admin'));
        } catch (error) {
          console.error('Error fetching user', error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    };

    checkUser();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};