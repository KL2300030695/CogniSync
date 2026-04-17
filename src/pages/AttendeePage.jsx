import React, { useState, useRef, useEffect } from 'react';
import { getLiveZoneData, VENUE_CONFIG, DEMO_CHAT_HISTORY } from '../data/venue-data';
import { sendMessageToEventFlow } from '../ai/eventflow-ai';
import { trackJournalSessionStart, trackVoiceInputUsed } from '../services/google-services';
import { sanitizeJournalText } from '../utils/security';

const QUICK_QUESTIONS = [
  '🍔 Food wait times?',
  '🚻 Nearest restroom?',
  '🚗 Parking status?',
  '🚪 Least crowded exit?',
  '🎤 How to reach main stage?',
  '⚠️ Any crowd alerts?',
];

const VENUE_SIDEBAR = [
  { label: 'Current Occupancy', value: '71%', color: 'var(--risk-medium)' },
  { label: 'Overall Risk',      value: 'MEDIUM', color: 'var(--risk-medium)' },
  { label: 'Active Alerts',     value: '3',   color: 'var(--risk-high)' },
  { label: 'Avg Queue Wait',    value: '9 min', color: 'var(--txt-primary)' },
];

export default function AttendeePage() {
  const [messages, setMessages] = useState(DEMO_CHAT_HISTORY);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const zones = getLiveZoneData();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => { trackJournalSessionStart(); }, []);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async (text) => {
    const clean = sanitizeJournalText(text.trim());
    if (!clean) return;

    const userMsg = { role: 'user', text: clean, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const totalOccupancy = Math.round(zones.reduce((s, z) => s + z.occupancy, 0) / zones.length);
    const context = {
      venue: VENUE_CONFIG.name,
      event: VENUE_CONFIG.event,
      overallOccupancy: totalOccupancy,
      highAlertZones: zones.filter(z => z.riskLevel === 'high' || z.riskLevel === 'critical').map(z => z.name),
      topCongestion: zones.sort((a, b) => b.occupancy - a.occupancy).slice(0, 3).map(z => `${z.name}: ${z.occupancy}%`),
    };

    try {
      const response = await sendMessageToEventFlow(clean, context, messages.slice(-6));
      setMessages(prev => [...prev, { role: 'assistant', text: response, time: now() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting. Please try again in a moment.", time: now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const startVoice = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) return;
    trackVoiceInputUsed();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onresult = (e) => { const t = e.results[0][0].transcript; setInput(t); };
    rec.start();
  };

  const renderText = (text) =>
    text.split('**').map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );

  return (
    <div className="page-full" style={{ display: 'flex', height: 'calc(100vh - 70px)' }}>

      {/* Venue Status Sidebar */}
      <aside
        style={{ width: 240, background: 'var(--clr-surface)', borderRight: '1px solid var(--clr-border-light)', padding: 'var(--sp-6)', overflowY: 'auto', flexShrink: 0 }}
        aria-label="Live venue status"
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--clr-primary)', marginBottom: 'var(--sp-4)' }}>
          🔴 Live Venue Status
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
          {VENUE_SIDEBAR.map(s => (
            <div key={s.label} style={{ padding: 'var(--sp-3)', background: 'var(--clr-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--clr-border-light)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--txt-muted)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt-muted)', marginBottom: 'var(--sp-3)' }}>
          Zone Occupancy
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {zones.slice(0, 6).map(z => (
            <div key={z.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
                <span style={{ color: 'var(--txt-secondary)' }}>{z.icon} {z.name.split('—')[0]}</span>
                <span style={{ color: `var(--risk-${z.riskLevel})`, fontWeight: 600 }}>{z.occupancy}%</span>
              </div>
              <div className="occ-bar">
                <div className={`occ-bar-fill ${z.riskLevel}`} style={{ width: `${z.occupancy}%` }} />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="chat-container" style={{ flex: 1, maxWidth: '100%' }}>
        {/* Header */}
        <div className="chat-header" role="banner">
          <div className="chat-avatar" aria-hidden="true">🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700 }}>EventFlow AI Assistant</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--txt-secondary)' }}>{VENUE_CONFIG.name} · {VENUE_CONFIG.event}</div>
          </div>
          <span className="badge badge-low">● Online</span>
        </div>

        {/* Quick Questions */}
        <div className="chat-quick-btns" role="toolbar" aria-label="Quick question shortcuts">
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} className="quick-btn" onClick={() => sendMessage(q.replace(/^[^\s]+ /, ''))} aria-label={`Ask: ${q}`}>
              {q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="chat-messages" role="log" aria-live="polite" aria-label="Conversation with EventFlow AI">
          {messages.map((m, i) => (
            <div key={i} className={`msg msg-${m.role}`}>
              {m.role === 'assistant' && (
                <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-accent))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }} aria-hidden="true">
                  🤖
                </div>
              )}
              <div>
                <div className="msg-bubble">{renderText(m.text)}</div>
                <div className="msg-time" aria-label={`Sent at ${m.time}`}>{m.time}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="msg msg-assistant">
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-accent))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }} aria-hidden="true">🤖</div>
              <div className="msg-bubble">
                <div className="typing-dots" aria-label="EventFlow AI is typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-row" role="form" aria-label="Message input">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask about wait times, directions, crowd levels..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Type your question"
            aria-multiline="true"
          />
          <button
            className="btn btn-ghost btn-sm"
            onClick={startVoice}
            aria-label={listening ? 'Listening...' : 'Start voice input'}
            title="Voice input"
            style={{ color: listening ? 'var(--clr-accent)' : undefined }}
          >
            {listening ? '🔴' : '🎤'}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            Send ↗
          </button>
        </div>
      </div>
    </div>
  );
}
