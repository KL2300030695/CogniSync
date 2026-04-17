import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isDashboard = location.pathname === '/dashboard';

  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/journal', label: 'Journal', icon: '📖' },
    { to: '/dashboard', label: 'Family Dashboard', icon: '📊' },
    { to: '/exercises', label: 'Exercises', icon: '🧩' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" id="nav-logo">
          <div className="navbar__logo-icon">🧠</div>
          <span>CogniSync</span>
        </Link>

        <ul className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`} id="nav-links">
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
                onClick={() => setIsOpen(false)}
                id={`nav-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span style={{ marginRight: '6px' }}>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="navbar__mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          id="nav-mobile-toggle"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
