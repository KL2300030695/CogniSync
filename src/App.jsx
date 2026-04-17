/**
 * EventFlow AI — Root application component.
 * Configures client-side routing and Google Analytics page tracking.
 * @module App
 */
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import AttendeePage from './pages/AttendeePage';
import StaffDashboard from './pages/StaffDashboard';
import QueueMonitor from './pages/QueueMonitor';
import VenueSettings from './pages/VenueSettings';
import { trackPageView } from './services/google-services';

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    const names = {
      '/':          'Home — EventFlow AI',
      '/attendee':  'AI Attendee Assistant',
      '/dashboard': 'Staff Operations Dashboard',
      '/queues':    'Queue Monitor',
      '/settings':  'Venue Settings',
    };
    trackPageView(names[location.pathname] || 'EventFlow AI', location.pathname);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <Router>
      <PageTracker />
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/"          element={<LandingPage />}    />
          <Route path="/attendee"  element={<AttendeePage />}   />
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/queues"    element={<QueueMonitor />}   />
          <Route path="/settings"  element={<VenueSettings />}  />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}
