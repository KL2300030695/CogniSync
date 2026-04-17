import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveJournalEntry,
  getJournalEntries,
  getRecentEntries,
  getPatientProfile,
  savePatientProfile,
  getSettings,
  saveSettings,
  saveExerciseResult,
  getExerciseResults,
  getSentimentHistory,
  getKeywordFrequencies,
  exportAllData,
  importData,
  clearAllData,
} from '../utils/storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Journal Entries', () => {
    it('should save and retrieve journal entries', () => {
      const entry = {
        messages: [{ role: 'patient', text: 'Hello Maya' }],
        sentiment: { score: 0.8, emotion: 'happy', keywords: ['hello'], clarity: 75 },
        patientText: 'Hello Maya',
      };

      const saved = saveJournalEntry(entry);
      expect(saved.id).toBeDefined();
      expect(saved.timestamp).toBeDefined();
      expect(saved.patientText).toBe('Hello Maya');

      const entries = getJournalEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].patientText).toBe('Hello Maya');
    });

    it('should save multiple entries and retrieve in order', () => {
      saveJournalEntry({ patientText: 'First entry' });
      saveJournalEntry({ patientText: 'Second entry' });
      saveJournalEntry({ patientText: 'Third entry' });

      const entries = getJournalEntries();
      expect(entries).toHaveLength(3);
      expect(entries[0].patientText).toBe('First entry');
      expect(entries[2].patientText).toBe('Third entry');
    });

    it('should get recent entries with limit', () => {
      for (let i = 0; i < 10; i++) {
        saveJournalEntry({ patientText: `Entry ${i}` });
      }

      const recent = getRecentEntries(3);
      expect(recent).toHaveLength(3);
      expect(recent[0].patientText).toBe('Entry 7');
    });

    it('should return empty array when no entries exist', () => {
      const entries = getJournalEntries();
      expect(entries).toEqual([]);
    });

    it('should filter entries by date range', () => {
      const now = new Date();
      const entry = saveJournalEntry({ patientText: 'Today' });

      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      const filtered = getJournalEntries({
        start: yesterday.toISOString(),
        end: tomorrow.toISOString(),
      });
      expect(filtered).toHaveLength(1);
    });
  });

  describe('Patient Profile', () => {
    it('should return default profile when none exists', () => {
      const profile = getPatientProfile();
      expect(profile.name).toBe('');
      expect(profile.preferredName).toBe('');
    });

    it('should save and retrieve patient profile', () => {
      savePatientProfile({ name: 'Margaret', preferredName: 'Maggie' });
      const profile = getPatientProfile();
      expect(profile.name).toBe('Margaret');
      expect(profile.preferredName).toBe('Maggie');
      expect(profile.updatedAt).toBeDefined();
    });

    it('should merge profile updates without losing data', () => {
      savePatientProfile({ name: 'Margaret', favoriteTopics: 'Gardening' });
      savePatientProfile({ preferredName: 'Maggie' });

      const profile = getPatientProfile();
      expect(profile.name).toBe('Margaret');
      expect(profile.preferredName).toBe('Maggie');
      expect(profile.favoriteTopics).toBe('Gardening');
    });
  });

  describe('Settings', () => {
    it('should return default settings when none exist', () => {
      const settings = getSettings();
      expect(settings.theme).toBe('patient');
      expect(settings.voiceEnabled).toBe(true);
      expect(settings.fontSize).toBe('large');
      expect(settings.autoSave).toBe(true);
    });

    it('should save and retrieve settings', () => {
      saveSettings({ fontSize: 'extra-large', voiceEnabled: false });
      const settings = getSettings();
      expect(settings.fontSize).toBe('extra-large');
      expect(settings.voiceEnabled).toBe(false);
      expect(settings.theme).toBe('patient'); // default preserved
    });
  });

  describe('Exercise Results', () => {
    it('should save and retrieve exercise results', () => {
      saveExerciseResult({ exerciseId: 'word_assoc', response: 'Sun' });
      saveExerciseResult({ exerciseId: 'memory_recall', response: 'My garden' });

      const results = getExerciseResults();
      expect(results).toHaveLength(2);
      expect(results[0].exerciseId).toBe('word_assoc');
      expect(results[1].exerciseId).toBe('memory_recall');
    });
  });

  describe('Analytics', () => {
    it('should return sentiment history with scores', () => {
      saveJournalEntry({
        sentiment: { score: 0.8, emotion: 'happy', clarity: 75, keywords: ['flowers'] },
      });
      saveJournalEntry({
        sentiment: { score: 0.5, emotion: 'calm', clarity: 60, keywords: ['garden'] },
      });

      const history = getSentimentHistory(30);
      expect(history).toHaveLength(2);
      expect(history[0].score).toBe(0.8);
      expect(history[1].clarity).toBe(60);
    });

    it('should compute keyword frequencies', () => {
      saveJournalEntry({ sentiment: { keywords: ['garden', 'roses', 'Margaret'] } });
      saveJournalEntry({ sentiment: { keywords: ['garden', 'birds', 'Margaret'] } });
      saveJournalEntry({ sentiment: { keywords: ['garden', 'cooking'] } });

      const keywords = getKeywordFrequencies();
      expect(keywords[0].word).toBe('garden');
      expect(keywords[0].count).toBe(3);
      expect(keywords.find(k => k.word === 'margaret').count).toBe(2);
    });
  });

  describe('Data Export/Import', () => {
    it('should export all data as JSON', () => {
      saveJournalEntry({ patientText: 'Test entry' });
      savePatientProfile({ name: 'Margaret' });
      saveSettings({ fontSize: 'extra-large' });

      const exported = exportAllData();
      const data = JSON.parse(exported);

      expect(data.version).toBe('1.0');
      expect(data.exportedAt).toBeDefined();
      expect(data.journalEntries).toHaveLength(1);
      expect(data.patientProfile.name).toBe('Margaret');
      expect(data.settings.fontSize).toBe('extra-large');
    });

    it('should import data successfully', () => {
      const jsonData = JSON.stringify({
        journalEntries: [{ id: 'test', patientText: 'Imported', timestamp: new Date().toISOString() }],
        patientProfile: { name: 'Imported Patient' },
        settings: { theme: 'dashboard' },
      });

      const result = importData(jsonData);
      expect(result.success).toBe(true);

      const entries = getJournalEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0].patientText).toBe('Imported');

      const profile = getPatientProfile();
      expect(profile.name).toBe('Imported Patient');
    });

    it('should handle invalid JSON gracefully', () => {
      const result = importData('invalid json');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Clear Data', () => {
    it('should clear all stored data', () => {
      saveJournalEntry({ patientText: 'Entry' });
      savePatientProfile({ name: 'Test' });
      saveSettings({ theme: 'dashboard' });

      clearAllData();

      expect(getJournalEntries()).toEqual([]);
      expect(getPatientProfile().name).toBe('');
      expect(getSettings().theme).toBe('patient');
    });
  });
});
