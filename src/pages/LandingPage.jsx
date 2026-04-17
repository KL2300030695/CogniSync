import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🧠', title: 'AI Crowd Intelligence', desc: 'Google Gemini analyzes real-time occupancy across all venue zones, predicting congestion 30 minutes before it happens.' },
  { icon: '⏱️', title: 'Wait-Time Prediction', desc: 'ML-powered queue forecasting for food courts, restrooms, entrances, and exits — with optimal visit window recommendations.' },
  { icon: '🗺️', title: 'Smart Navigation', desc: 'Crowd-aware routing guides attendees through the least congested paths, updating in real time as conditions change.' },
  { icon: '🚨', title: 'Safety Alert System', desc: 'Automatic alerts when zones exceed safety thresholds. Staff get specific, actionable interventions — not just data.' },
  { icon: '📊', title: 'Operations Dashboard', desc: 'Real-time visibility across all venue zones on a single screen. Filter by risk level, category, or trend direction.' },
  { icon: '🔗', title: 'Firebase Real-Time Sync', desc: 'All crowd data, alerts, and analytics synced instantly across every staff device via Firebase Firestore.' },
];

const STEPS = [
  { label: 'Sense', title: 'Real-Time Zone Monitoring', desc: 'IoT sensors and entry counters feed live occupancy data for every zone into the EventFlow platform.' },
  { label: 'Analyze', title: 'Google Gemini AI Analysis', desc: 'Gemini processes multi-zone data simultaneously, identifies patterns, predicts peak times, and generates crowd risk scores.' },
  { label: 'Act', title: 'Intelligent Recommendations', desc: 'Staff receive specific interventions (open Gate D, activate overflow counter). Attendees get personalized navigation via the AI assistant.' },
  { label: 'Learn', title: 'Continuous Improvement', desc: 'Every event builds a richer historical dataset, making predictions more accurate for future events at the same venue.' },
];

export default function LandingPage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="landing-hero" aria-label="Hero section">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grid-lines" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-badge">
            <span>🎪</span>
            PromptWars Virtual · Physical Event Experience Challenge
          </div>

          <h1 className="hero-title">
            Optimize Every<br />
            <span className="hero-title-grad">Event Experience</span><br />
            with AI
          </h1>

          <p className="hero-sub">
            EventFlow AI transforms chaotic stadium and venue crowd management into a proactive, 
            data-driven experience — powered by Google Gemini, Firebase, and real-time analytics.
          </p>

          <div className="hero-ctas">
            <Link to="/attendee" className="btn btn-primary btn-lg">
              🤖 Try AI Assistant
            </Link>
            <Link to="/dashboard" className="btn btn-ghost btn-lg">
              📊 Staff Dashboard →
            </Link>
          </div>

          <div className="hero-stats" role="list" aria-label="Impact statistics">
            <div className="hero-stat" role="listitem">
              <div className="hero-stat-num">52K</div>
              <div className="hero-stat-label">Attendees Managed</div>
            </div>
            <div className="hero-stat" role="listitem">
              <div className="hero-stat-num">12</div>
              <div className="hero-stat-label">Venue Zones Monitored</div>
            </div>
            <div className="hero-stat" role="listitem">
              <div className="hero-stat-num">30m</div>
              <div className="hero-stat-label">Congestion Prediction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" aria-labelledby="features-heading">
        <p className="section-label">Core Capabilities</p>
        <h2 className="section-title" id="features-heading">Everything You Need to Run a Flawless Event</h2>
        <p className="section-sub">From real-time crowd heatmaps to AI-generated staff interventions — all in one platform.</p>

        <div className="grid-3">
          {FEATURES.map((f, i) => (
            <article key={i} className="feature-card">
              <div className="feature-icon" aria-hidden="true">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" aria-labelledby="how-heading">
        <p className="section-label">How It Works</p>
        <h2 className="section-title" id="how-heading">The EventFlow Intelligence Loop</h2>
        <p className="section-sub">A closed-loop system that senses, analyzes, acts, and learns — continuously.</p>

        <div className="steps" role="list">
          {STEPS.map((s, i) => (
            <div key={i} className="step" role="listitem">
              <div className="step-num" aria-hidden="true">{s.label}</div>
              <div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google Services */}
      <section className="features-section" aria-labelledby="tech-heading">
        <p className="section-label">Powered By</p>
        <h2 className="section-title" id="tech-heading">Google Services Integration</h2>
        <div className="grid-3">
          {[
            { icon: '🧠', name: 'Google Gemini AI', desc: 'Natural language crowd analysis, navigation guidance, and staff recommendations.' },
            { icon: '🔥', name: 'Firebase Firestore', desc: 'Real-time data sync across all staff devices with offline persistence.' },
            { icon: '🗺️', name: 'Google Maps Places', desc: 'Venue navigation, parking guidance, and nearby facility discovery.' },
            { icon: '📈', name: 'Google Analytics 4', desc: 'Anonymized usage tracking and operational performance insights.' },
            { icon: '🔊', name: 'Google Cloud TTS', desc: 'Audio crowd advisories for accessibility and PA system integration.' },
            { icon: '🔤', name: 'Google Fonts', desc: 'Inter & Space Grotesk for high-legibility, professional venue display.' },
          ].map((s, i) => (
            <article key={i} className="feature-card">
              <div className="feature-icon" aria-hidden="true">{s.icon}</div>
              <h3 className="feature-title">{s.name}</h3>
              <p className="feature-desc">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="section-title" style={{ marginBottom: 'var(--sp-4)' }}>
          Ready to Transform Your Event?
        </h2>
        <p className="section-sub" style={{ marginBottom: 'var(--sp-8)' }}>
          Try the live AI assistant or explore the staff operations dashboard.
        </p>
        <div className="hero-ctas">
          <Link to="/attendee" className="btn btn-primary btn-lg">🤖 Open AI Assistant</Link>
          <Link to="/dashboard" className="btn btn-accent btn-lg">📊 View Live Dashboard</Link>
        </div>
      </section>
    </main>
  );
}
