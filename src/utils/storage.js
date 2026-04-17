/**
 * EventFlow AI — localStorage Persistence Layer
 *
 * All event data is stored locally on-device by default.
 * No data is transmitted without explicit user consent (Firebase opt-in).
 *
 * Key design decisions:
 *  - Storage keys are namespaced with 'eventflow_' prefix to avoid collisions
 *  - All reads are wrapped in try/catch to handle corrupted storage gracefully
 *  - Default values are always returned when data is missing
 *  - Timestamps are ISO 8601 strings for cross-platform compatibility
 *
 * @module storage
 */

/** @type {Object.<string, string>} Namespaced localStorage keys */
const STORAGE_KEYS = {
  JOURNAL_ENTRIES:  'eventflow_session_logs',
  PATIENT_PROFILE:  'eventflow_venue_profile',
  SETTINGS:         'eventflow_settings',
  EXERCISE_RESULTS: 'eventflow_facility_results',
};

// ─────────────────────────────────────────────
// Journal Entries
// ─────────────────────────────────────────────

/**
 * Save a new journal entry to localStorage.
 * Automatically generates a unique ID and timestamp.
 *
 * @param {Object} entry - Partial entry object to save
 * @param {Object[]} [entry.messages] - Chat message array
 * @param {Object} [entry.sentiment] - Sentiment analysis result
 * @param {string} [entry.patientText] - Raw patient text for this session
 * @returns {Object} Complete saved entry with generated id and timestamp
 */
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

/**
 * Retrieve all journal entries, optionally filtered by date range.
 *
 * @param {Object|null} [dateRange=null] - Optional date filter
 * @param {string} dateRange.start - ISO 8601 start date string
 * @param {string} dateRange.end   - ISO 8601 end date string
 * @returns {Object[]} Array of journal entry objects (oldest first)
 */
export function getJournalEntries(dateRange = null) {
  try {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES) || '[]');
    if (!dateRange) return entries;

    const { start, end } = dateRange;
    return entries.filter((e) => {
      const date = new Date(e.timestamp);
      return date >= new Date(start) && date <= new Date(end);
    });
  } catch {
    return [];
  }
}

/**
 * Get the most recent N journal entries.
 *
 * @param {number} [count=7] - Number of entries to return
 * @returns {Object[]} Array of the most recent entries (oldest first within slice)
 */
export function getRecentEntries(count = 7) {
  const entries = getJournalEntries();
  return entries.slice(-count);
}

/**
 * Get all journal entries recorded today (midnight to now).
 *
 * @returns {Object[]} Today's journal entries
 */
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

// ─────────────────────────────────────────────
// Patient Profile
// ─────────────────────────────────────────────

/** @type {Object} Default patient profile values */
const DEFAULT_PROFILE = {
  name:               '',
  preferredName:      '',
  age:                '',
  familyMembers:      '',
  favoriteTopics:     '',
  importantMemories:  '',
  musicPreferences:   '',
  dietaryPreferences: '',
  createdAt: new Date().toISOString(),
};

/**
 * Retrieve the stored patient profile, or default values if none exists.
 *
 * @returns {Object} Patient profile object
 */
export function getPatientProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE));
    return profile || { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

/**
 * Save (merge-update) the patient profile.
 * Existing fields are preserved when not included in the update.
 *
 * @param {Object} profile - Partial profile fields to update
 * @returns {Object} Complete updated profile
 */
export function savePatientProfile(profile) {
  const existing = getPatientProfile();
  const updated = { ...existing, ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(updated));
  return updated;
}

// ─────────────────────────────────────────────
// App Settings
// ─────────────────────────────────────────────

/** @type {Object} Default application settings */
const DEFAULT_SETTINGS = {
  theme:        'patient',      // 'patient' | 'dashboard'
  voiceEnabled: true,
  fontSize:     'large',        // 'normal' | 'large' | 'extra-large'
  autoSave:     true,
  apiKey:       '',
};

/**
 * Retrieve current app settings merged with defaults.
 *
 * @returns {Object} App settings object
 */
export function getSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save (merge-update) app settings.
 *
 * @param {Object} settings - Partial settings to update
 * @returns {Object} Complete updated settings
 */
export function saveSettings(settings) {
  const existing = getSettings();
  const updated = { ...existing, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

// ─────────────────────────────────────────────
// Cognitive Exercise Results
// ─────────────────────────────────────────────

/**
 * Persist a cognitive exercise result.
 *
 * @param {Object} result - Exercise result to save
 * @param {string} result.exerciseId - Exercise identifier
 * @param {string} [result.response]  - Patient's response
 * @returns {void}
 */
export function saveExerciseResult(result) {
  const results = getExerciseResults();
  results.push({
    id: Date.now().toString(36),
    timestamp: new Date().toISOString(),
    ...result,
  });
  localStorage.setItem(STORAGE_KEYS.EXERCISE_RESULTS, JSON.stringify(results));
}

/**
 * Retrieve all stored cognitive exercise results.
 *
 * @returns {Object[]} Array of exercise result objects
 */
export function getExerciseResults() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISE_RESULTS) || '[]');
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// Analytics Helpers
// ─────────────────────────────────────────────

/**
 * Get sentiment data points for the last N days.
 * Used to populate the sentiment trend chart on the family dashboard.
 *
 * @param {number} [days=30] - Lookback window in days
 * @returns {Array<{date: string, score: number, emotion: string, clarity: number}>}
 */
export function getSentimentHistory(days = 30) {
  const entries = getJournalEntries();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return entries
    .filter((e) => new Date(e.timestamp) >= cutoff && e.sentiment)
    .map((e) => ({
      date:    e.timestamp,
      score:   e.sentiment?.score   ?? 0.5,
      emotion: e.sentiment?.emotion ?? 'calm',
      clarity: e.sentiment?.clarity ?? 50,
    }));
}

/**
 * Get clarity score data points for the last N days.
 *
 * @param {number} [days=30] - Lookback window in days
 * @returns {Array<{date: string, clarity: number}>}
 */
export function getClarityHistory(days = 30) {
  const entries = getJournalEntries();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return entries
    .filter((e) => new Date(e.timestamp) >= cutoff && e.sentiment)
    .map((e) => ({
      date:    e.timestamp,
      clarity: e.sentiment?.clarity ?? 50,
    }));
}

/**
 * Compute keyword frequency across all journal entries.
 * Returns top 30 keywords sorted by frequency descending.
 *
 * @returns {Array<{word: string, count: number}>}
 */
export function getKeywordFrequencies() {
  const entries = getJournalEntries();
  const freq = {};

  entries.forEach((entry) => {
    if (Array.isArray(entry.sentiment?.keywords)) {
      entry.sentiment.keywords.forEach((kw) => {
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

// ─────────────────────────────────────────────
// Data Export / Import
// ─────────────────────────────────────────────

/**
 * Export all stored data as a formatted JSON string.
 * Includes a version field for future migration compatibility.
 *
 * @returns {string} Pretty-printed JSON string
 */
export function exportAllData() {
  return JSON.stringify(
    {
      version:        '1.0',
      exportedAt:     new Date().toISOString(),
      journalEntries: getJournalEntries(),
      patientProfile: getPatientProfile(),
      settings:       getSettings(),
      exerciseResults: getExerciseResults(),
    },
    null,
    2
  );
}

/**
 * Import data from a JSON string (e.g., from a previous export).
 * Gracefully handles partial data — only keys present are restored.
 * Guards against prototype pollution via safe JSON parsing.
 *
 * @param {string} jsonString - JSON string to import
 * @returns {{ success: boolean, error?: string }}
 */
export function importData(jsonString) {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { success: false, error: 'Input must be a non-empty string' };
    }
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

/**
 * Remove all EventFlow AI data from localStorage.
 * Irreversible — used from Settings page with user confirmation.
 *
 * @returns {void}
 */
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
