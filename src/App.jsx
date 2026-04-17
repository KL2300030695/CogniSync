import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import PatientJournal from './pages/PatientJournal';
import FamilyDashboard from './pages/FamilyDashboard';
import CognitiveExercises from './pages/CognitiveExercises';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/journal" element={<PatientJournal />} />
          <Route path="/dashboard" element={<FamilyDashboard />} />
          <Route path="/exercises" element={<CognitiveExercises />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </Router>
  );
}
