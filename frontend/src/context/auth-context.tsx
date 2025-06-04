'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAuthSession, getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

// Configure Amplify directly
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'eu-west-1_J7EKiwTfA',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'n7u78450uvmbtgjdf6iai58cm',
      identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || 'eu-west-1:85133464-309e-41a4-b886-00d28efcfeab',
      loginWith: {
        username: true,
        email: true,
      }
    }
  },
  API: {
    REST: {
      TaskBuddyAPI: {
        endpoint: process.env.NEXT_PUBLIC_API_URL || 'https://uzoqf3buyb.execute-api.eu-west-1.amazonaws.com/Prod',
        region: process.env.NEXT_PUBLIC_REGION || 'eu-west-1',
      }
    }
  }
});

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
  isLoading: false,
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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
        
        const groups = session.tokens?.accessToken.payload['cognito:groups'] || [];
        setIsAdmin(Array.isArray(groups) && groups.includes('admin'));
      } catch (error) {
        setUser(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
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
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};