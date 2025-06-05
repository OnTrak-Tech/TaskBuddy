import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import { getEnv } from './utils/env'

// Configure Amplify
Amplify.configure({
  Auth: {
    region: getEnv('VITE_AWS_REGION'),
    userPoolId: getEnv('VITE_USER_POOL_ID'),
    userPoolWebClientId: getEnv('VITE_USER_POOL_CLIENT_ID'),
    mandatorySignIn: true,
  },
  API: {
    endpoints: [
      {
        name: 'taskbuddyApi',
        endpoint: getEnv('VITE_API_ENDPOINT'),
        region: getEnv('VITE_AWS_REGION')
      }
    ]
  }
})

// For debugging
console.log('Environment:', {
  region: getEnv('VITE_AWS_REGION'),
  userPoolId: getEnv('VITE_USER_POOL_ID'),
  userPoolWebClientId: getEnv('VITE_USER_POOL_CLIENT_ID'),
  apiEndpoint: getEnv('VITE_API_ENDPOINT')
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)