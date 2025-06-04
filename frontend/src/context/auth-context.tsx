'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAuthSession, getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';
import { configureAmplify } from '@/lib/amplify-config';

interface User {
  username: string;
  attributes: {
    email: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isLoading: true,
  signOut: () => {},
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

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Configure Amplify
        configureAmplify();
        
        try {
          // Get current user
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
          
          // Check if user is admin
          const groups = session.tokens?.accessToken.payload['cognito:groups'] || [];
          setIsAdmin(Array.isArray(groups) && groups.includes('admin'));
        } catch (authError) {
          // Not authenticated - this is normal
          setUser(null);
          setIsAdmin(false);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
      } finally {
        // Always set loading to false
        setIsLoading(false);
      }
    };

    // Run auth check
    checkUser();
  }, []);

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};