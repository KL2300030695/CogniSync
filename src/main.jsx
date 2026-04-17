/**
 * EventFlow AI — Application entry point.
 * Bootstraps the React app, initializes Google Analytics, and mounts to DOM.
 * @module main
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initGoogleAnalytics } from './services/google-services';

// Initialize Google Analytics
initGoogleAnalytics();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
