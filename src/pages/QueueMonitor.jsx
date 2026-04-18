import React, { useState, useEffect } from 'react';
import { getLiveQueueData } from '../data/venue-data';
import { predictWaitTime } from '../ai/eventflow-ai';

const STATUS_META = {
  clear:    { label: 'Clear',    color: 'var(--risk-low)',      bg: 'rgba(16,185,129,0.08)' },
  moderate: { label: 'Moderate', color: 'var(--risk-medium)',   bg: 'rgba(245,158,11,0.08)' },
  busy:     { label: 'Busy',     color: 'var(--risk-high)',     bg: 'rgba(239,68,68,0.08)'  },
  critical: { label: 'Critical', color: 'var(--risk-critical)', bg: 'rgba(255,45,85,0.08)'  },
};

export default function QueueMonitor() {
  const [queues, setQueues]       = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [predFacility, setPredFacility] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadQueues = () => {
    setQueues(getLiveQueueData());
    setLastRefresh(new Date());
  };

  useEffect(() => {
    loadQueues();
    const interval = setInterval(loadQueues, 20000);
    return () => clearInterval(interval);
  }, []);

  const getPrediction = async (queue) => {
    setPredFacility(queue.name);
    setLoading(true);
    setPrediction(null);
    try {
      const data = { queueLength: queue.queueLength, currentWait: queue.currentWait };
      const result = await predictWaitTime(queue.name, data);
      setPrediction(result);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterStatus === 'all' ? queues : queues.filter(q => q.status === filterStatus);
  const avgWait  = queues.length ? Math.round(queues.reduce((s, q) => s + q.currentWait, 0) / queues.length) : 0;
  const criticalCount = queues.filter(q => q.status === 'critical').length;
  const clearCount    = queues.filter(q => q.status === 'clear').length;

  return (
    <div className="page" id="main-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--clr-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Real-Time Queue Intelligence
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.8rem', fontWeight: 800 }}>⏱️ Queue Monitor</h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--txt-secondary)', marginTop: 2 }}>
            Last updated: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 20s
          </div>
        </div>
        <button className="btn btn-ghost" onClick={loadQueues} aria-label="Refresh queue data">
          🔄 Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid-4 mb-8" role="list" aria-label="Queue summary statistics">
        <div className="stat-card" role="listitem">
          <div className="stat-label">Average Wait</div>
          <div className="stat-value">{avgWait}<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--txt-secondary)' }}> min</span></div>
          <div className="stat-sub">Across all facilities</div>
        </div>
        <div className="stat-card" role="listitem">
          <div className="stat-label">Critical Queues</div>
          <div className="stat-value" style={{ color: criticalCount > 0 ? 'var(--risk-critical)' : 'var(--risk-low)' }}>{criticalCount}</div>
          <div className="stat-sub">Wait &gt;15 min</div>
        </div>
        <div className="stat-card" role="listitem">
          <div className="stat-label">Clear Queues</div>
          <div className="stat-value" style={{ color: 'var(--risk-low)' }}>{clearCount}</div>
          <div className="stat-sub">Wait &lt;5 min — go now!</div>
        </div>
        <div className="stat-card" role="listitem">
          <div className="stat-label">Total Facilities</div>
          <div className="stat-value">{queues.length}</div>
          <div className="stat-sub">All zones monitored</div>
        </div>
      </div>

      <div className="grid-2 mb-8" style={{ alignItems: 'start' }}>
        {/* Queue List */}
        <section aria-labelledby="queue-list-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="queue-list-heading" style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700 }}>
              All Facilities
            </h2>
            <div className="flex gap-2" role="group" aria-label="Filter by queue status">
              {['all', 'critical', 'busy', 'moderate', 'clear'].map(s => (
                <button
                  key={s}
                  className="btn btn-ghost btn-sm"
                  onClick={() => setFilterStatus(s)}
                  style={{ color: filterStatus === s ? 'var(--clr-primary)' : undefined, border: filterStatus === s ? '1px solid var(--clr-primary)' : undefined }}
                  aria-pressed={filterStatus === s}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }} role="list" aria-label="Queue facilities">
            {filtered.map(q => {
              const meta = STATUS_META[q.status];
              return (
                <div
                  key={q.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)', background: q.status === 'critical' ? meta.bg : 'var(--clr-card)', border: `1px solid ${q.status === 'critical' ? 'rgba(255,45,85,0.3)' : 'var(--clr-border-light)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => getPrediction(q)}
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && getPrediction(q)}
                  aria-label={`${q.name}: ${q.currentWait} min wait, ${q.status} status. Click for AI prediction`}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{q.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginTop: 2 }}>Queue: {q.queueLength} people · Best time: {q.bestTime}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 700, color: meta.color, lineHeight: 1 }}>{q.currentWait}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--txt-muted)', textTransform: 'uppercase' }}>min wait</div>
                  </div>
                  <span className={`badge badge-${q.status === 'busy' || q.status === 'critical' ? q.status === 'critical' ? 'critical' : 'high' : q.status === 'moderate' ? 'medium' : 'low'}`}>
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Prediction Panel */}
        <section aria-labelledby="prediction-heading">
          <h2 id="prediction-heading" style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--sp-4)' }}>
            🧠 AI Wait-Time Prediction
          </h2>

          {!predFacility && !loading && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--txt-muted)', padding: 'var(--sp-10)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--sp-3)' }}>🤖</div>
              <div style={{ fontSize: '0.9rem' }}>Click any facility to get an AI-powered wait time prediction and alternatives</div>
            </div>
          )}

          {loading && (
            <div className="card">
              <div className="loading-wrap">
                <div className="spinner" aria-hidden="true" />
                <div>Analyzing {predFacility}...</div>
              </div>
            </div>
          )}

          {prediction && !loading && (
            <div className="card">
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--clr-primary)', marginBottom: 'var(--sp-4)' }}>
                📍 {predFacility}
              </div>

              <div className="grid-2 mb-6">
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--txt-muted)', marginBottom: 4 }}>Current Wait</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.5rem', fontWeight: 800, color: prediction.currentWaitMinutes >= 15 ? 'var(--risk-critical)' : prediction.currentWaitMinutes >= 10 ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                    {prediction.currentWaitMinutes}<span style={{ fontSize: '1rem', fontWeight: 400 }}>min</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--txt-muted)', marginBottom: 4 }}>Best Time to Visit</div>
                  <div style={{ fontWeight: 600, color: 'var(--risk-low)', fontSize: '0.9rem' }}>{prediction.bestTimeToVisit}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginTop: 4 }}>Confidence: {prediction.confidence}</div>
                </div>
              </div>

              {(prediction.alternatives || []).length > 0 && (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 'var(--sp-3)', fontSize: '0.875rem' }}>🔀 Shorter Alternatives</div>
                  {prediction.alternatives.map((alt, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-3)', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{alt.facility}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)' }}>{alt.distance}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--risk-low)' }}>{alt.estimatedWait}min</div>
                    </div>
                  ))}
                </div>
              )}

              {prediction.reasoning && (
                <div style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-3)', background: 'rgba(45,125,210,0.06)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--txt-secondary)' }}>
                  💡 {prediction.reasoning}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
