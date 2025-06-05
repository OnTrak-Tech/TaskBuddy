// This file is for local development only
// In production, user management should be handled by backend APIs

import { Auth } from 'aws-amplify';

// Helper functions for Cognito admin operations
export const cognitoAdmin = {
  // Create a new user
  async createUser(userData: {
    username: string;
    email: string;
    name: string;
    role?: string;
  }) {
    try {
      // In production, this should call a backend API
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          role: userData.role || 'user'
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        user: { Username: userData.username },
        tempPassword: data.tempPassword || 'Check email for password'
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Reset a user's password
  async resetUserPassword(username: string) {
    try {
      // In production, this should call a backend API
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/admin/users/${username}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return { tempPassword: data.tempPassword || 'Check email for password' };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
};

export default cognitoAdmin;