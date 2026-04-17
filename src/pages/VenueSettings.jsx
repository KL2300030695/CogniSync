import React, { useState } from 'react';
import { VENUE_CONFIG } from '../data/venue-data';
import { isFirebaseConfigured, isMapsConfigured } from '../services/google-services';
import { isValidApiKey } from '../utils/security';
import { exportAllData, clearAllData } from '../utils/storage';

export default function VenueSettings() {
  const [geminiKey, setGeminiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY ? '••••••••••••••••' : '');
  const [venueName, setVenueName] = useState(VENUE_CONFIG.name);
  const [eventName, setEventName] = useState(VENUE_CONFIG.event);
  const [capacity,  setCapacity]  = useState(String(VENUE_CONFIG.capacity));
  const [saved,     setSaved]     = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExport = () => {
    const blob = new Blob([exportAllData()], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'eventflow-data.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const googleServices = [
    { name: 'Google Gemini AI',         status: !!import.meta.env.VITE_GEMINI_API_KEY, role: 'Core AI engine' },
    { name: 'Firebase Firestore',        status: isFirebaseConfigured(),                 role: 'Real-time sync' },
    { name: 'Google Maps Places API',    status: isMapsConfigured(),                     role: 'Navigation' },
    { name: 'Google Analytics 4',        status: !!import.meta.env.VITE_GA_MEASUREMENT_ID, role: 'Usage tracking' },
    { name: 'Google Cloud TTS',          status: !!import.meta.env.VITE_GOOGLE_TTS_KEY, role: 'Audio advisories' },
    { name: 'Google Fonts',              status: true,                                   role: 'Typography' },
  ];

  return (
    <div className="page" id="main-content">
      <div style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 'var(--sp-8)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--clr-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Configuration
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.8rem', fontWeight: 800 }}>⚙️ Venue Settings</h1>
        </div>

        {/* Venue Config */}
        <section className="card mb-6" aria-labelledby="venue-config-heading">
          <h2 id="venue-config-heading" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 'var(--sp-6)' }}>Venue Configuration</h2>
          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <div>
                <label htmlFor="venue-name" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--sp-2)', fontSize: '0.875rem' }}>
                  Venue Name
                </label>
                <input id="venue-name" className="input-field" value={venueName} onChange={e => setVenueName(e.target.value)} placeholder="e.g. Nexus Arena" aria-required="true" />
              </div>
              <div>
                <label htmlFor="event-name" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--sp-2)', fontSize: '0.875rem' }}>
                  Event Name
                </label>
                <input id="event-name" className="input-field" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="e.g. TechFest 2026" />
              </div>
              <div>
                <label htmlFor="capacity" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--sp-2)', fontSize: '0.875rem' }}>
                  Total Venue Capacity
                </label>
                <input id="capacity" className="input-field" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="e.g. 52000" aria-required="true" min="1" />
              </div>
              <div>
                <label htmlFor="api-key" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--sp-2)', fontSize: '0.875rem' }}>
                  Gemini API Key
                </label>
                <input id="api-key" className="input-field" type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="AIza..." aria-describedby="api-key-hint" autoComplete="off" />
                <div id="api-key-hint" style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginTop: 4 }}>
                  {geminiKey && !geminiKey.includes('•') ? (isValidApiKey(geminiKey) ? '✅ Valid format' : '❌ Invalid format') : 'Get your key at aistudio.google.com'}
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} aria-label="Save venue settings">
                {saved ? '✅ Saved!' : '💾 Save Settings'}
              </button>
            </div>
          </form>
        </section>

        {/* Google Services Status */}
        <section className="card mb-6" aria-labelledby="services-heading">
          <h2 id="services-heading" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 'var(--sp-5)' }}>
            Google Services Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }} role="list" aria-label="Google services configuration status">
            {googleServices.map((svc, i) => (
              <div key={i} className="settings-row" role="listitem">
                <div>
                  <div className="settings-label">{svc.name}</div>
                  <div className="settings-desc">{svc.role}</div>
                </div>
                <span className={`badge badge-${svc.status ? 'low' : 'high'}`} aria-label={`${svc.name} is ${svc.status ? 'configured' : 'not configured'}`}>
                  {svc.status ? '✓ Active' : '○ Not Set'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Data Management */}
        <section className="card" aria-labelledby="data-heading">
          <h2 id="data-heading" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 'var(--sp-5)' }}>Data Management</h2>
          <div className="settings-row">
            <div>
              <div className="settings-label">Export Event Data</div>
              <div className="settings-desc">Download all event analytics as JSON</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleExport} aria-label="Export event data as JSON">
              📥 Export JSON
            </button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">Clear Local Data</div>
              <div className="settings-desc">Remove all stored session and analytics data</div>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => { if (window.confirm('Clear all data? This cannot be undone.')) clearAllData(); }}
              aria-label="Clear all local data"
            >
              🗑️ Clear Data
            </button>
          </div>
          <div className="settings-row" style={{ borderBottom: 'none' }}>
            <div>
              <div className="settings-label">App Version</div>
              <div className="settings-desc">EventFlow AI v1.0 · PromptWars Virtual 2026</div>
            </div>
            <span className="badge badge-info">v1.0</span>
          </div>
        </section>
      </div>
    </div>
  );
}
