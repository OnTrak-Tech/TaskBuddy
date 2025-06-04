import { CognitoIdentityServiceProvider } from 'aws-sdk';

// Helper functions for Cognito admin operations
export const cognitoAdmin = {
  // Create a new user as admin
  async createUser(userData: {
    username: string;
    email: string;
    name: string;
    role?: string;
    department?: string;
  }) {
    try {
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + 
                          Math.random().toString(36).toUpperCase().slice(-4) + 
                          '!1';
      
      // Create Cognito service provider
      const cognito = new CognitoIdentityServiceProvider({
        region: import.meta.env.VITE_AWS_REGION,
      });
      
      // Set credentials
      cognito.config.credentials = {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
      };
      
      // Prepare user attributes
      const userAttributes = [
        { Name: 'email', Value: userData.email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: userData.name }
      ];
      

      
      // Create user
      const createUserParams = {
        UserPoolId: import.meta.env.VITE_USER_POOL_ID,
        Username: userData.username,
        TemporaryPassword: tempPassword,
        UserAttributes: userAttributes
        // Removed MessageAction: 'SUPPRESS' to allow Cognito to send welcome emails
      };
      
      const createResult = await cognito.adminCreateUser(createUserParams).promise();
      
      // Add user to appropriate group if role is specified
      if (userData.role) {
        try {
          const addToGroupParams = {
            UserPoolId: import.meta.env.VITE_USER_POOL_ID,
            Username: userData.username,
            GroupName: userData.role.toLowerCase()
          };
          
          await cognito.adminAddUserToGroup(addToGroupParams).promise();
        } catch (groupError) {
          console.warn('Could not add user to group:', groupError);
          // Continue even if group assignment fails
        }
      }
      
      // Return result with temp password
      return {
        user: createResult.User,
        tempPassword
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Reset a user's password
  async resetUserPassword(username: string) {
    try {
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + 
                          Math.random().toString(36).toUpperCase().slice(-4) + 
                          '!1';
      
      // Create Cognito service provider
      const cognito = new CognitoIdentityServiceProvider({
        region: import.meta.env.VITE_AWS_REGION,
      });
      
      // Set credentials
      cognito.config.credentials = {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
      };
      
      // Reset password
      const params = {
        UserPoolId: import.meta.env.VITE_USER_POOL_ID,
        Username: username,
        Password: tempPassword,
        Permanent: false
      };
      
      await cognito.adminSetUserPassword(params).promise();
      
      return { tempPassword };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
};

export default cognitoAdmin;