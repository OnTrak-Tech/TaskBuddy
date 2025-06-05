// Central configuration file for the application
const config = {
  aws: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
    sesEmail: import.meta.env.VITE_SES_SENDER_EMAIL
  }
};

export default config;