import React, { useState, useEffect } from 'react';
import { getPatientProfile, savePatientProfile, getSettings, saveSettings, exportAllData, importData, clearAllData } from '../utils/storage';
import AlertBanner from '../components/AlertBanner';

export default function Settings() {
  const [profile, setProfile] = useState(getPatientProfile());
  const [settings, setSettings] = useState(getSettings());
  const [saved, setSaved] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    savePatientProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSettingsChange = (field, value) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognisync-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importData(event.target.result);
      if (result.success) {
        setImportStatus({ type: 'success', message: 'Data imported successfully! Refresh to see changes.' });
        setProfile(getPatientProfile());
        setSettings(getSettings());
      } else {
        setImportStatus({ type: 'danger', message: `Import failed: ${result.error}` });
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      clearAllData();
      setProfile(getPatientProfile());
      setSettings(getSettings());
      setImportStatus({ type: 'success', message: 'All data has been cleared.' });
    }
  };

  return (
    <div className="settings page-enter">
      <h1 className="heading-lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        ⚙️ Settings
      </h1>

      {saved && (
        <AlertBanner type="success" message="Profile saved successfully! Maya will use this information in conversations." />
      )}

      {importStatus && (
        <AlertBanner type={importStatus.type} message={importStatus.message} onDismiss={() => setImportStatus(null)} />
      )}

      {/* Patient Profile */}
      <div className="settings__section">
        <h2 className="settings__section-title">👤 Patient Profile</h2>
        <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-md)' }}>
          This information helps Maya personalize conversations. All data stays on your device.
        </p>

        <div className="form-group">
          <label className="form-label" htmlFor="patient-name">Full Name</label>
          <input
            className="form-input"
            id="patient-name"
            type="text"
            value={profile.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            placeholder="e.g., Margaret Thompson"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="preferred-name">Preferred Name</label>
          <input
            className="form-input"
            id="preferred-name"
            type="text"
            value={profile.preferredName}
            onChange={(e) => handleProfileChange('preferredName', e.target.value)}
            placeholder="e.g., Maggie, Grandma, Mom"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="family-members">Family Members (helps Maya reference them)</label>
          <textarea
            className="form-textarea"
            id="family-members"
            value={profile.familyMembers}
            onChange={(e) => handleProfileChange('familyMembers', e.target.value)}
            placeholder="e.g., Husband: Robert (deceased), Daughter: Margaret, Granddaughter: Sarah (age 8)"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="favorite-topics">Favorite Topics & Interests</label>
          <textarea
            className="form-textarea"
            id="favorite-topics"
            value={profile.favoriteTopics}
            onChange={(e) => handleProfileChange('favoriteTopics', e.target.value)}
            placeholder="e.g., Gardening (roses), cooking, Frank Sinatra, birdwatching, the lake house"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="important-memories">Important Memories to Cherish</label>
          <textarea
            className="form-textarea"
            id="important-memories"
            value={profile.importantMemories}
            onChange={(e) => handleProfileChange('importantMemories', e.target.value)}
            placeholder="e.g., Wedding in June 1975, berry picking at the farm, Sarah's first visit, winning the rose competition"
          />
        </div>

        <button className="btn btn-primary" onClick={handleSaveProfile} id="save-profile-btn">
          💾 Save Profile
        </button>
      </div>

      {/* App Settings */}
      <div className="settings__section">
        <h2 className="settings__section-title">🎨 App Settings</h2>

        <div className="form-group">
          <label className="form-label" htmlFor="font-size">Text Size</label>
          <select
            className="form-input"
            id="font-size"
            value={settings.fontSize}
            onChange={(e) => handleSettingsChange('fontSize', e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="normal">Normal</option>
            <option value="large">Large (Recommended)</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <label className="form-label" htmlFor="voice-enabled" style={{ margin: 0 }}>
            Voice Input Enabled
          </label>
          <input
            type="checkbox"
            id="voice-enabled"
            checked={settings.voiceEnabled}
            onChange={(e) => handleSettingsChange('voiceEnabled', e.target.checked)}
            style={{ width: '20px', height: '20px' }}
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <label className="form-label" htmlFor="auto-save" style={{ margin: 0 }}>
            Auto-save Journal Entries
          </label>
          <input
            type="checkbox"
            id="auto-save"
            checked={settings.autoSave}
            onChange={(e) => handleSettingsChange('autoSave', e.target.checked)}
            style={{ width: '20px', height: '20px' }}
          />
        </div>
      </div>

      {/* Data Management */}
      <div className="settings__section">
        <h2 className="settings__section-title">💾 Data Management</h2>
        <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-md)' }}>
          All data is stored locally on this device. Export regularly for backup.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExport} id="export-data-btn">
            📤 Export All Data
          </button>

          <label className="btn btn-secondary" style={{ cursor: 'pointer' }} id="import-data-btn">
            📥 Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>

          <button
            className="btn btn-ghost"
            onClick={handleClearData}
            style={{ color: 'var(--danger)' }}
            id="clear-data-btn"
          >
            🗑️ Clear All Data
          </button>
        </div>
      </div>

      {/* About */}
      <div className="settings__section">
        <h2 className="settings__section-title">ℹ️ About CogniSync</h2>
        <div className="glass-card glass-card--static" style={{ marginBottom: 'var(--space-md)' }}>
          <p className="text-reading" style={{ marginBottom: 'var(--space-md)' }}>
            <strong>CogniSync</strong> is an AI-powered memory care companion designed to support 
            people with early-stage Alzheimer's and Dementia, and their families.
          </p>
          <p className="text-sm text-muted">
            Powered by Google Gemini AI · Web Speech API · Built with React
          </p>
          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-xs)' }}>
            ⚠️ CogniSync is not a medical device and does not provide medical advice. 
            Always consult healthcare professionals for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
