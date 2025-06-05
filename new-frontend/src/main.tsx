import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Amplify } from 'aws-amplify'
import config from './config'

// Configure Amplify
Amplify.configure({
  Auth: {
    region: config.aws.region,
    userPoolId: config.aws.userPoolId,
    userPoolWebClientId: config.aws.userPoolClientId,
    mandatorySignIn: true,
  },
  API: {
    endpoints: [
      {
        name: 'taskbuddyApi',
        endpoint: config.aws.apiEndpoint,
        region: config.aws.region
      }
    ]
  }
})

// Log configuration for debugging
console.log('App initialized with region:', config.aws.region);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)