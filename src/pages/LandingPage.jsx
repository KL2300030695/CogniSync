import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg"></div>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div className="hero__content">
            <div className="hero__badge">
              <span>🧠</span>
              <span>AI-Powered Memory Care</span>
            </div>
            <h1 className="heading-xl hero__title">
              Gentle AI companion for{' '}
              <span className="text-gradient">memory care</span>
            </h1>
            <p className="hero__subtitle">
              CogniSync helps families caring for loved ones with early-stage Alzheimer's and Dementia. 
              Our AI companion Maya provides warm, patient conversations while tracking cognitive health over time.
            </p>
            <div className="hero__actions">
              <Link to="/journal" className="btn btn-primary btn-lg" id="hero-start-journal">
                📖 Start Journaling
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-lg" id="hero-view-dashboard">
                📊 Family Dashboard
              </Link>
            </div>
          </div>

          {/* Animated Brain Visual */}
          <div className="hero__visual">
            <div className="brain-orb">
              <div className="brain-orb__circle brain-orb__circle--1"></div>
              <div className="brain-orb__circle brain-orb__circle--2"></div>
              <div className="brain-orb__circle brain-orb__circle--3"></div>
              <div className="brain-orb__emoji">🧠</div>
              <div className="brain-orb__particle"></div>
              <div className="brain-orb__particle"></div>
              <div className="brain-orb__particle"></div>
              <div className="brain-orb__particle"></div>
              <div className="brain-orb__particle"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            <div className="stat-card" style={{ animation: 'fadeInUp 0.5s ease 0.1s both' }}>
              <div className="stat-card__number text-gradient">55M+</div>
              <div className="stat-card__label">People living with dementia worldwide</div>
            </div>
            <div className="stat-card" style={{ animation: 'fadeInUp 0.5s ease 0.2s both' }}>
              <div className="stat-card__number text-gradient">70%</div>
              <div className="stat-card__label">Caregivers report feeling overwhelmed</div>
            </div>
            <div className="stat-card" style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
              <div className="stat-card__number text-gradient">∞</div>
              <div className="stat-card__label">Patience of our AI companion Maya</div>
            </div>
            <div className="stat-card" style={{ animation: 'fadeInUp 0.5s ease 0.4s both' }}>
              <div className="stat-card__number text-gradient">100%</div>
              <div className="stat-card__label">Private — all data stays on your device</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <div className="section__header">
            <h2 className="heading-lg">How CogniSync <span className="text-gradient">helps</span></h2>
            <p className="section__subtitle">
              Built with deep empathy and cutting-edge AI to support both patients and their families.
            </p>
          </div>

          <div className="features__grid">
            <div className="feature-card" style={{ animation: 'fadeInUp 0.5s ease 0.1s both' }}>
              <div className="feature-card__icon feature-card__icon--lavender">🎤</div>
              <h3 className="feature-card__title">Voice-Friendly Journal</h3>
              <p className="feature-card__desc">
                Speak naturally — Maya listens with infinite patience. No typing needed. 
                The conversation flows like talking to a caring friend.
              </p>
            </div>

            <div className="feature-card" style={{ animation: 'fadeInUp 0.5s ease 0.2s both' }}>
              <div className="feature-card__icon feature-card__icon--sage">🧠</div>
              <h3 className="feature-card__title">Empathetic AI Companion</h3>
              <p className="feature-card__desc">
                Maya never rushes, never judges, and never corrects. She gently encourages 
                memory recall through warm, sensory-rich conversations.
              </p>
            </div>

            <div className="feature-card" style={{ animation: 'fadeInUp 0.5s ease 0.3s both' }}>
              <div className="feature-card__icon feature-card__icon--coral">📊</div>
              <h3 className="feature-card__title">Family Dashboard</h3>
              <p className="feature-card__desc">
                Track sentiment trends, cognitive clarity, and keyword patterns over time. 
                Get gentle alerts when concerning patterns emerge.
              </p>
            </div>

            <div className="feature-card" style={{ animation: 'fadeInUp 0.5s ease 0.4s both' }}>
              <div className="feature-card__icon feature-card__icon--rose">🧩</div>
              <h3 className="feature-card__title">Cognitive Exercises</h3>
              <p className="feature-card__desc">
                Gentle, non-frustrating memory games that adapt to the patient's comfort level.
                Word associations, story continuation, and sensory exploration.
              </p>
            </div>

            <div className="feature-card" style={{ animation: 'fadeInUp 0.5s ease 0.5s both' }}>
              <div className="feature-card__icon feature-card__icon--lavender">🔒</div>
              <h3 className="feature-card__title">Complete Privacy</h3>
              <p className="feature-card__desc">
                All conversations and data stay on your device. No cloud storage, no data mining. 
                Export your data anytime in standard JSON format.
              </p>
            </div>

            <div className="feature-card" style={{ animation: 'fadeInUp 0.5s ease 0.6s both' }}>
              <div className="feature-card__icon feature-card__icon--sage">💡</div>
              <h3 className="feature-card__title">Smart Insights</h3>
              <p className="feature-card__desc">
                AI-powered analysis detects mood changes, clarity fluctuations, and potential 
                red flags — empowering families to act early.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section--alt">
        <div className="container">
          <div className="section__header">
            <h2 className="heading-lg">Getting started is <span className="text-gradient">simple</span></h2>
            <p className="section__subtitle">Three simple steps to begin your memory care journey.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-xl)', maxWidth: '900px', margin: '0 auto' }}>
            {[
              { step: '1', emoji: '👤', title: 'Set up a profile', desc: 'Enter your loved one\'s name, interests, and important memories to personalize Maya\'s conversations.' },
              { step: '2', emoji: '💬', title: 'Start a journal session', desc: 'Speak or type — Maya will respond with warmth, gently encouraging memory recall and cognitive engagement.' },
              { step: '3', emoji: '📈', title: 'Track progress', desc: 'Check the family dashboard for sentiment trends, clarity scores, and AI-generated insights about cognitive health.' },
            ].map((item, i) => (
              <div key={i} className="glass-card text-center" style={{ animation: `fadeInUp 0.5s ease ${0.2 + i * 0.15}s both` }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, var(--lavender-400), var(--lavender-600))',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.2rem', margin: '0 auto var(--space-md)',
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>{item.emoji}</div>
                <h3 className="heading-sm" style={{ marginBottom: 'var(--space-sm)' }}>{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container container-sm">
          <h2 className="heading-lg" style={{ marginBottom: 'var(--space-md)' }}>
            Every conversation <span className="text-gradient">matters</span>
          </h2>
          <p className="text-lg text-muted" style={{ marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            Start today. Give your loved one the gift of a patient, caring AI companion 
            who will always listen.
          </p>
          <Link to="/journal" className="btn btn-primary btn-lg" id="cta-start-journal">
            🌸 Begin Your First Session
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>🧠 CogniSync — AI-Powered Memory Care Companion</p>
          <p style={{ marginTop: 'var(--space-xs)' }}>
            Built with empathy, powered by Google Gemini AI.
            All data stays on your device. ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
