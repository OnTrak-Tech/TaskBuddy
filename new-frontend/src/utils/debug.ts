// Debug utility to help troubleshoot authentication issues
export const debugAuth = (user: any) => {
  if (!user) {
    console.log('User is not authenticated');
    return;
  }
  
  console.log('User authenticated:', user.username);
  
  // Check for groups in the token
  const groups = user?.signInUserSession?.accessToken?.payload['cognito:groups'];
  console.log('User groups from token:', groups);
  
  // Check if user is admin based on email
  const isAdminByEmail = user.username === 'kwesijay8@gmail.com';
  console.log('Is admin by email check:', isAdminByEmail);
  
  // Check if user is in admin group
  const isAdminByGroup = Array.isArray(groups) && groups.includes('admin');
  console.log('Is admin by group check:', isAdminByGroup);
  
  // Log the full token payload for inspection
  console.log('Token payload:', user?.signInUserSession?.accessToken?.payload);
};