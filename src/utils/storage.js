/**
 * CogniSync Local Storage Helpers
 * All data stays on-device for privacy.
 */

const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'cognisync_journal_entries',
  PATIENT_PROFILE: 'cognisync_patient_profile',
  SETTINGS: 'cognisync_settings',
  EXERCISE_RESULTS: 'cognisync_exercise_results',
};

// ============================================
// Journal Entries
// ============================================

export function saveJournalEntry(entry) {
  const entries = getJournalEntries();
  const newEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  entries.push(newEntry);
  localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
  return newEntry;
}

export function getJournalEntries(dateRange = null) {
  try {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES) || '[]');
    if (!dateRange) return entries;

    const { start, end } = dateRange;
    return entries.filter(e => {
      const date = new Date(e.timestamp);
      return date >= new Date(start) && date <= new Date(end);
    });
  } catch {
    return [];
  }
}

export function getRecentEntries(count = 7) {
  const entries = getJournalEntries();
  return entries.slice(-count);
}

export function getEntriesToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return getJournalEntries({
    start: today.toISOString(),
    end: tomorrow.toISOString(),
  });
}

// ============================================
// Patient Profile
// ============================================

const DEFAULT_PROFILE = {
  name: '',
  preferredName: '',
  age: '',
  familyMembers: '',
  favoriteTopics: '',
  importantMemories: '',
  musicPreferences: '',
  dietaryPreferences: '',
  createdAt: new Date().toISOString(),
};

export function getPatientProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE));
    return profile || { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function savePatientProfile(profile) {
  const existing = getPatientProfile();
  const updated = { ...existing, ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(updated));
  return updated;
}

// ============================================
// Settings
// ============================================

const DEFAULT_SETTINGS = {
  theme: 'patient', // 'patient' | 'dashboard'
  voiceEnabled: true,
  fontSize: 'large', // 'normal' | 'large' | 'extra-large'
  autoSave: true,
  apiKey: '',
};

export function getSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  const existing = getSettings();
  const updated = { ...existing, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

// ============================================
// Exercise Results
// ============================================

export function saveExerciseResult(result) {
  const results = getExerciseResults();
  results.push({
    id: Date.now().toString(36),
    timestamp: new Date().toISOString(),
    ...result,
  });
  localStorage.setItem(STORAGE_KEYS.EXERCISE_RESULTS, JSON.stringify(results));
}

export function getExerciseResults() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISE_RESULTS) || '[]');
  } catch {
    return [];
  }
}

// ============================================
// Analytics Helpers
// ============================================

export function getSentimentHistory(days = 30) {
  const entries = getJournalEntries();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return entries
    .filter(e => new Date(e.timestamp) >= cutoff && e.sentiment)
    .map(e => ({
      date: e.timestamp,
      score: e.sentiment?.score || 0.5,
      emotion: e.sentiment?.emotion || 'calm',
      clarity: e.sentiment?.clarity || 50,
    }));
}

export function getClarityHistory(days = 30) {
  const entries = getJournalEntries();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return entries
    .filter(e => new Date(e.timestamp) >= cutoff && e.sentiment)
    .map(e => ({
      date: e.timestamp,
      clarity: e.sentiment?.clarity || 50,
    }));
}

export function getKeywordFrequencies() {
  const entries = getJournalEntries();
  const freq = {};

  entries.forEach(entry => {
    if (entry.sentiment?.keywords) {
      entry.sentiment.keywords.forEach(kw => {
        const word = kw.toLowerCase();
        freq[word] = (freq[word] || 0) + 1;
      });
    }
  });

  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
}

// ============================================
// Data Export/Import
// ============================================

export function exportAllData() {
  return JSON.stringify({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    journalEntries: getJournalEntries(),
    patientProfile: getPatientProfile(),
    settings: getSettings(),
    exerciseResults: getExerciseResults(),
  }, null, 2);
}

export function importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.journalEntries) {
      localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(data.journalEntries));
    }
    if (data.patientProfile) {
      localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(data.patientProfile));
    }
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    }
    if (data.exerciseResults) {
      localStorage.setItem(STORAGE_KEYS.EXERCISE_RESULTS, JSON.stringify(data.exerciseResults));
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
