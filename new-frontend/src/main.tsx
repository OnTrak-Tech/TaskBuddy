import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { configureAmplify } from './lib/amplifyConfig';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Configure Amplify before rendering
configureAmplify();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);