import React, { useState, useEffect } from 'react';
import SentimentChart from '../components/SentimentChart';
import ClarityGauge from '../components/ClarityGauge';
import KeywordCloud from '../components/KeywordCloud';
import AlertBanner from '../components/AlertBanner';
import { getSentimentHistory, getClarityHistory, getKeywordFrequencies, getRecentEntries, getJournalEntries } from '../utils/storage';
import { loadSampleData } from '../data/sample-entries';
import { formatDate, formatTime, getRelativeTime } from '../utils/date-helpers';
import { getTrendDirection } from '../ai/sentiment-analyzer';

export default function FamilyDashboard() {
  const [timeRange, setTimeRange] = useState(30);
  const [sentimentData, setSentimentData] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [stats, setStats] = useState({ avgSentiment: 0, avgClarity: 0, totalEntries: 0, concerns: [] });
  const [hasSample, setHasSample] = useState(false);

  // Set dashboard theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dashboard');
    return () => document.documentElement.removeAttribute('data-theme');
  }, []);

  // Load data
  useEffect(() => {
    refreshData();
  }, [timeRange]);

  const refreshData = () => {
    const sentiment = getSentimentHistory(timeRange);
    setSentimentData(sentiment);

    const kw = getKeywordFrequencies();
    setKeywords(kw);

    const recent = getRecentEntries(5);
    setRecentEntries(recent);

    const allEntries = getJournalEntries();
    const concerns = [];
    
    // Calculate averages
    if (sentiment.length > 0) {
      const avgS = sentiment.reduce((a, b) => a + b.score, 0) / sentiment.length;
      const avgC = sentiment.reduce((a, b) => a + b.clarity, 0) / sentiment.length;
      
      // Check for concerns
      const recentSentiments = sentiment.slice(-3);
      if (recentSentiments.some(s => s.score < 0.3)) {
        concerns.push({ type: 'warning', text: 'Low sentiment detected in recent sessions' });
      }
      if (recentSentiments.some(s => s.clarity < 40)) {
        concerns.push({ type: 'danger', text: 'Significant drop in clarity score observed' });
      }

      // Check entries for flagged concerns
      recent.forEach(entry => {
        if (entry.sentiment?.concerns?.length > 0) {
          entry.sentiment.concerns.forEach(c => {
            if (!concerns.find(x => x.text === c)) {
              concerns.push({ type: c.includes('URGENT') ? 'danger' : 'warning', text: c });
            }
          });
        }
      });

      setStats({
        avgSentiment: Math.round(avgS * 100),
        avgClarity: Math.round(avgC),
        totalEntries: allEntries.length,
        concerns,
      });
    } else {
      setStats({ avgSentiment: 0, avgClarity: 0, totalEntries: allEntries.length, concerns });
    }
  };

  const handleLoadSample = () => {
    loadSampleData();
    setHasSample(true);
    refreshData();
  };

  const sentimentTrend = getTrendDirection(sentimentData.map(d => d.score * 100));
  const clarityTrend = getTrendDirection(sentimentData.map(d => d.clarity));

  const trendIcon = (trend) => {
    if (trend === 'improving') return '↑';
    if (trend === 'declining') return '↓';
    return '→';
  };

  const trendClass = (trend) => {
    if (trend === 'improving') return 'widget__change--up';
    if (trend === 'declining') return 'widget__change--down';
    return '';
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh' }}>
      <div className="container-lg" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <h1 className="heading-lg" style={{ marginBottom: 'var(--space-xs)' }}>
              Family <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted">Cognitive health insights for caregivers</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            {sentimentData.length === 0 && (
              <button className="btn btn-accent btn-sm" onClick={handleLoadSample} id="load-sample-btn">
                📥 Load Sample Data
              </button>
            )}
            <select
              className="form-input"
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
              id="time-range-select"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
        </div>

        {/* Alerts */}
        {stats.concerns.map((concern, i) => (
          <AlertBanner key={i} type={concern.type} message={concern.text} />
        ))}

        {/* Quick Stats */}
        <div className="dashboard__grid" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="dashboard__widget dashboard__widget--quarter" id="stat-total-entries">
            <div className="widget__header">
              <span className="widget__title">Total Sessions</span>
              <span style={{ fontSize: '1.5rem' }}>📖</span>
            </div>
            <div className="widget__value text-gradient">{stats.totalEntries}</div>
            <span className="text-xs text-muted">Journal entries</span>
          </div>

          <div className="dashboard__widget dashboard__widget--quarter" id="stat-avg-sentiment">
            <div className="widget__header">
              <span className="widget__title">Avg Sentiment</span>
              <span style={{ fontSize: '1.5rem' }}>💛</span>
            </div>
            <div className="widget__value" style={{ color: stats.avgSentiment >= 60 ? 'var(--success)' : stats.avgSentiment >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
              {stats.avgSentiment}%
            </div>
            <span className={`widget__change ${trendClass(sentimentTrend)}`}>
              {trendIcon(sentimentTrend)} {sentimentTrend}
            </span>
          </div>

          <div className="dashboard__widget dashboard__widget--quarter" id="stat-avg-clarity">
            <div className="widget__header">
              <span className="widget__title">Avg Clarity</span>
              <span style={{ fontSize: '1.5rem' }}>🧠</span>
            </div>
            <div className="widget__value" style={{ color: stats.avgClarity >= 60 ? 'var(--success)' : stats.avgClarity >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
              {stats.avgClarity}
            </div>
            <span className={`widget__change ${trendClass(clarityTrend)}`}>
              {trendIcon(clarityTrend)} {clarityTrend}
            </span>
          </div>

          <div className="dashboard__widget dashboard__widget--quarter" id="stat-mood">
            <div className="widget__header">
              <span className="widget__title">Recent Mood</span>
              <span style={{ fontSize: '1.5rem' }}>
                {sentimentData.length > 0 ? (
                  sentimentData[sentimentData.length - 1].score > 0.6 ? '😊' :
                  sentimentData[sentimentData.length - 1].score > 0.4 ? '😐' : '😟'
                ) : '—'}
              </span>
            </div>
            <div className="widget__value" style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
              {sentimentData.length > 0 ? sentimentData[sentimentData.length - 1].emotion : 'N/A'}
            </div>
            <span className="text-xs text-muted">Last session</span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="dashboard__grid" style={{ marginBottom: 'var(--space-xl)' }}>
          {/* Sentiment Chart */}
          <div className="dashboard__widget" style={{ gridColumn: 'span 8' }} id="sentiment-chart-widget">
            <div className="widget__header">
              <span className="widget__title">Sentiment & Clarity Trends</span>
            </div>
            <SentimentChart data={sentimentData} height={320} />
          </div>

          {/* Clarity Gauge */}
          <div className="dashboard__widget" style={{ gridColumn: 'span 4' }} id="clarity-gauge-widget">
            <div className="widget__header">
              <span className="widget__title">Current Clarity Score</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-md)' }}>
              <ClarityGauge score={sentimentData.length > 0 ? sentimentData[sentimentData.length - 1].clarity : 0} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
              <p className="text-sm text-muted">Based on latest journal entry</p>
            </div>
          </div>
        </div>

        {/* Keywords + Recent Sessions */}
        <div className="dashboard__grid">
          {/* Keywords */}
          <div className="dashboard__widget" style={{ gridColumn: 'span 5' }} id="keyword-cloud-widget">
            <div className="widget__header">
              <span className="widget__title">Memory Keywords</span>
            </div>
            <KeywordCloud keywords={keywords} />
          </div>

          {/* Recent Sessions */}
          <div className="dashboard__widget" style={{ gridColumn: 'span 7' }} id="recent-sessions-widget">
            <div className="widget__header">
              <span className="widget__title">Recent Sessions</span>
            </div>
            {recentEntries.length === 0 ? (
              <p className="text-muted" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
                No journal entries yet. Start a journal session to see data here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {recentEntries.slice().reverse().map((entry, i) => (
                  <div key={entry.id} style={{
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                      <span className="text-sm" style={{ fontWeight: 600 }}>
                        {formatDate(entry.timestamp)} · {formatTime(entry.timestamp)}
                      </span>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                        {entry.sentiment && (
                          <>
                            <span className={`badge ${entry.sentiment.score > 0.6 ? 'badge--success' : entry.sentiment.score > 0.4 ? 'badge--warning' : 'badge--danger'}`}>
                              {Math.round(entry.sentiment.score * 100)}% sentiment
                            </span>
                            <span className="badge badge--info">
                              {entry.sentiment.clarity}/100 clarity
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted" style={{ lineHeight: 1.5 }}>
                      {entry.patientText || entry.sentiment?.summary || 'Journal session recorded'}
                    </p>
                    {entry.sentiment?.keywords?.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', marginTop: 'var(--space-xs)', flexWrap: 'wrap' }}>
                        {entry.sentiment.keywords.slice(0, 5).map((kw, j) => (
                          <span key={j} style={{
                            fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-full)',
                            background: 'var(--accent-bg)', color: 'var(--accent-primary)',
                          }}>
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
