import React, { useState, useEffect } from 'react';
import { getLiveZoneData, getVenueStats, ALERTS, VENUE_CONFIG } from '../data/venue-data';
import { analyzeCrowdData } from '../ai/eventflow-ai';
import { trackDashboardView, syncToFirestore, initFirebase } from '../services/google-services';

const RISK_META = {
  low:      { label: 'LOW',      emoji: '🟢', color: 'var(--risk-low)' },
  medium:   { label: 'MEDIUM',   emoji: '🟡', color: 'var(--risk-medium)' },
  high:     { label: 'HIGH',     emoji: '🔴', color: 'var(--risk-high)' },
  critical: { label: 'CRITICAL', emoji: '🚨', color: 'var(--risk-critical)' },
};

const TREND_ICON = { rising: '↑', stable: '→', falling: '↓' };
const TREND_COLOR = { rising: 'var(--risk-high)', stable: 'var(--txt-secondary)', falling: 'var(--risk-low)' };

export default function StaffDashboard() {
  const [zones, setZones]       = useState(() => getLiveZoneData());
  const [stats, setStats]       = useState(() => getVenueStats(getLiveZoneData()));
  const [alerts, setAlerts]     = useState(ALERTS);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [filter, setFilter]     = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadData = () => {
    const live = getLiveZoneData();
    setZones(live);
    setStats(getVenueStats(live));
    setLastRefresh(new Date());
  };

  useEffect(() => {
    initFirebase();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stats) trackDashboardView(stats.totalCount);
  }, [stats]);

  const runAIAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const crowdData = {
        zones: Object.fromEntries(zones.map(z => [z.name, { occupancy: z.occupancy, trend: z.trend }])),
        totalCount: stats?.totalCount,
        currentTime: new Date().toLocaleTimeString(),
      };
      const result = await analyzeCrowdData(crowdData);
      setAnalysis(result);

      // Sync analysis to Firebase
      await syncToFirestore([{
        id: `analysis_${Date.now()}`,
        type: 'crowd_analysis',
        timestamp: new Date().toISOString(),
        ...result,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));

  const filteredZones = filter === 'all' ? zones : zones.filter(z => z.riskLevel === filter || z.category === filter);

  const risk = stats ? RISK_META[stats.overallRisk] : RISK_META.low;
  const pct  = stats ? Math.round((stats.totalCount / stats.totalCapacity) * 100) : 0;

  return (
    <div className="page" id="main-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--clr-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Staff Operations Dashboard
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.8rem', fontWeight: 800 }}>
            {VENUE_CONFIG.name}
          </h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--txt-secondary)', marginTop: 2 }}>
            {VENUE_CONFIG.event} · Refreshed {lastRefresh.toLocaleTimeString()}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn btn-ghost" onClick={loadData} aria-label="Refresh zone data">
            🔄 Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={runAIAnalysis}
            disabled={loading}
            aria-label="Run AI crowd analysis"
          >
            {loading ? '🧠 Analyzing...' : '🧠 AI Analysis'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid-4 mb-8" role="list" aria-label="Venue statistics">
          <div className="stat-card" role="listitem">
            <div className="stat-label">Total Attendees</div>
            <div className="stat-value">{stats.totalCount.toLocaleString()}</div>
            <div className="stat-sub">{pct}% of {stats.totalCapacity.toLocaleString()} capacity</div>
          </div>
          <div className="stat-card" role="listitem">
            <div className="stat-label">Overall Risk</div>
            <div className="stat-value" style={{ color: risk.color }}>{risk.emoji} {risk.label}</div>
            <div className="stat-sub">Avg occupancy: {stats.avgOccupancy}%</div>
          </div>
          <div className="stat-card" role="listitem">
            <div className="stat-label">Critical Zones</div>
            <div className="stat-value" style={{ color: stats.criticalZones > 0 ? 'var(--risk-critical)' : 'var(--risk-low)' }}>
              {stats.criticalZones}
            </div>
            <div className="stat-sub">{stats.highZones} high-risk zones</div>
          </div>
          <div className="stat-card" role="listitem">
            <div className="stat-label">Active Alerts</div>
            <div className="stat-value" style={{ color: 'var(--risk-high)' }}>
              {alerts.filter(a => !a.resolved).length}
            </div>
            <div className="stat-sub">{alerts.filter(a => a.resolved).length} resolved today</div>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {alerts.filter(a => !a.resolved).length > 0 && (
        <section className="mb-8" aria-labelledby="alerts-heading">
          <h2 id="alerts-heading" style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--sp-4)' }}>
            🚨 Active Alerts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }} role="list">
            {alerts.filter(a => !a.resolved).map(alert => (
              <div key={alert.id}
                className={`alert alert-${alert.type === 'critical' ? 'critical' : alert.type === 'warning' ? 'warning' : 'info'}`}
                role="listitem"
                aria-label={`${alert.type} alert: ${alert.message}`}
              >
                <div className="alert-icon" aria-hidden="true">
                  {alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="alert-title">{alert.zone}</div>
                  <div className="alert-msg">{alert.message}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--txt-muted)', marginTop: 4 }}>{alert.time}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => dismissAlert(alert.id)} aria-label={`Dismiss alert for ${alert.zone}`}>
                  Resolve ✓
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Analysis */}
      {analysis && (
        <section className="card mb-8" aria-labelledby="ai-analysis-heading">
          <h2 id="ai-analysis-heading" style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--sp-5)' }}>
            🧠 AI Crowd Analysis
          </h2>
          <div className="grid-3 mb-6">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginBottom: 4 }}>Risk Score</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 800, color: RISK_META[analysis.riskLevel?.toLowerCase()]?.color || 'var(--clr-primary)' }}>
                {analysis.riskScore}/100
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginBottom: 4 }}>Risk Level</div>
              <span className={`badge badge-${analysis.riskLevel?.toLowerCase()}`}>{analysis.riskLevel}</span>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginBottom: 4 }}>Peak Prediction</div>
              <div style={{ fontSize: '0.85rem' }}>{analysis.peakPrediction}</div>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <div style={{ fontWeight: 600, marginBottom: 'var(--sp-3)' }}>🏥 Staff Actions Required</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {(analysis.staffActions || []).map((a, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', padding: 'var(--sp-2) var(--sp-3)', background: 'rgba(239,68,68,0.08)', borderRadius: 6, borderLeft: '2px solid var(--risk-high)' }}>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 'var(--sp-3)' }}>📢 Attendee Advisory</div>
              <div style={{ fontSize: '0.875rem', padding: 'var(--sp-3) var(--sp-4)', background: 'rgba(45,125,210,0.08)', borderRadius: 8, borderLeft: '2px solid var(--clr-primary)' }}>
                {analysis.attendeeAdvisory}
              </div>
              {(analysis.alternativeRoutes || []).length > 0 && (
                <div style={{ marginTop: 'var(--sp-3)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--txt-muted)', marginBottom: 'var(--sp-2)' }}>Alternative Routes:</div>
                  {analysis.alternativeRoutes.map((r, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: 'var(--txt-secondary)', marginBottom: 4 }}>→ {r}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Zone Filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700 }}>
          🗺️ Zone Status ({filteredZones.length} of {zones.length})
        </h2>
        <div className="flex gap-2" role="group" aria-label="Filter zones by risk level">
          {['all','critical','high','medium','low'].map(f => (
            <button key={f} className={`btn btn-ghost btn-sm ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              style={{ color: filter === f ? 'var(--clr-primary)' : undefined, border: filter === f ? '1px solid var(--clr-primary)' : undefined }}
              aria-pressed={filter === f}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Zone Grid */}
      <div className="grid-auto" role="list" aria-label="All venue zones">
        {filteredZones.map(z => (
          <div key={z.id} className={`zone-card ${z.riskLevel}`} role="listitem" aria-label={`${z.name}: ${z.occupancy}% occupancy, ${z.riskLevel} risk`}>
            <div className="zone-header">
              <span className="zone-icon" aria-hidden="true">{z.icon}</span>
              <span className={`badge badge-${z.riskLevel}`}>{z.riskLevel}</span>
            </div>
            <div className="zone-name">{z.name}</div>
            <div className="zone-count">{z.count.toLocaleString()} / {z.capacity.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <div className={`zone-pct risk-${z.riskLevel}`}>{z.occupancy}%</div>
              <div className="zone-trend" style={{ color: TREND_COLOR[z.trend] }}>
                {TREND_ICON[z.trend]} {z.trend}
              </div>
            </div>
            <div className="occ-bar" role="progressbar" aria-valuenow={z.occupancy} aria-valuemin={0} aria-valuemax={100} aria-label={`${z.name} occupancy`}>
              <div className={`occ-bar-fill ${z.riskLevel}`} style={{ width: `${z.occupancy}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
