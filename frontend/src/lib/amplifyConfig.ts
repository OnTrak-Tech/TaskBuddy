// AWS Amplify configuration
const config = {
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    mandatorySignIn: true,
  },
  API: {
    endpoints: [
      {
        name: 'taskbuddyApi',
        endpoint: import.meta.env.VITE_API_ENDPOINT,
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      },
    ],
  },
}

export default config