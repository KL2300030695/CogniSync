import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <NavLink to="/" className="navbar-logo" aria-label="EventFlow AI Home">
        <div className="navbar-logo-icon" aria-hidden="true">🎪</div>
        <span>EventFlow <span style={{ color: 'var(--clr-accent)', fontWeight: 300 }}>AI</span></span>
      </NavLink>

      <div className="navbar-live" aria-live="polite" aria-label="System status: live monitoring">
        <div className="navbar-live-dot" aria-hidden="true" />
        LIVE MONITORING
      </div>

      <ul className="navbar-nav" role="list">
        <li>
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/attendee" className={({isActive}) => isActive ? 'active' : ''}>
            🤖 AI Assistant
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
            📊 Staff Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/queues" className={({isActive}) => isActive ? 'active' : ''}>
            ⏱️ Queue Monitor
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>
            ⚙️ Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
