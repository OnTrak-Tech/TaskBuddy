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
      setIsLoading(true);
      try {
        // Ensure Amplify is configured before making auth calls
        configureAmplify();
        
        // Get current user
        const userInfo = await getCurrentUser();
        // Get session to access tokens
        const session = await fetchAuthSession();
        
        setIsAuthenticated(true);
        
        const currentUser = {
          ...userInfo,
          attributes: {
            email: userInfo.username,
            ...userInfo.signInDetails?.loginId ? { email: userInfo.signInDetails.loginId } : {}
          }
        };
        
        setUser(currentUser);
        
        // Check if user is admin
        const groups = session.tokens?.accessToken.payload['cognito:groups'] || [];
        setIsAdmin(Array.isArray(groups) && groups.includes('admin'));
      } catch (error) {
        console.error('Error fetching user', error);
        setUser(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
        
        // Don't throw errors for auth-related issues as they're expected for unauthenticated users
        if (error instanceof Error && 
            !error.toString().includes('UserUnAuthenticatedException') && 
            !error.toString().includes('No current user')) {
          console.error('Unexpected auth error:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};