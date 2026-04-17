import { describe, it, expect, beforeEach } from 'vitest';
import { loadSampleData, hasSampleData, SAMPLE_ENTRIES } from '../data/sample-entries';

describe('Sample Data', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('SAMPLE_ENTRIES', () => {
    it('should contain multiple demo entries', () => {
      expect(SAMPLE_ENTRIES.length).toBeGreaterThan(5);
    });

    it('should have required fields for each entry', () => {
      SAMPLE_ENTRIES.forEach(entry => {
        expect(entry.id).toBeDefined();
        expect(entry.timestamp).toBeDefined();
        expect(entry.messages).toBeDefined();
        expect(entry.messages.length).toBeGreaterThan(0);
        expect(entry.sentiment).toBeDefined();
      });
    });

    it('should have valid sentiment data', () => {
      SAMPLE_ENTRIES.forEach(entry => {
        expect(entry.sentiment.score).toBeGreaterThanOrEqual(0);
        expect(entry.sentiment.score).toBeLessThanOrEqual(1);
        expect(entry.sentiment.emotion).toBeDefined();
        expect(entry.sentiment.clarity).toBeGreaterThanOrEqual(0);
        expect(entry.sentiment.clarity).toBeLessThanOrEqual(100);
        expect(Array.isArray(entry.sentiment.keywords)).toBe(true);
      });
    });

    it('should have both patient and maya messages', () => {
      SAMPLE_ENTRIES.forEach(entry => {
        const hasPatient = entry.messages.some(m => m.role === 'patient');
        const hasMaya = entry.messages.some(m => m.role === 'maya');
        expect(hasPatient).toBe(true);
        expect(hasMaya).toBe(true);
      });
    });

    it('should have demo IDs starting with demo_', () => {
      SAMPLE_ENTRIES.forEach(entry => {
        expect(entry.id.startsWith('demo_')).toBe(true);
      });
    });
  });

  describe('loadSampleData', () => {
    it('should load data into localStorage when empty', () => {
      const loaded = loadSampleData();
      expect(loaded).toBe(true);

      const stored = JSON.parse(localStorage.getItem('cognisync_journal_entries'));
      expect(stored.length).toBe(SAMPLE_ENTRIES.length);
    });

    it('should not overwrite existing data', () => {
      localStorage.setItem('cognisync_journal_entries', JSON.stringify([{ id: 'existing' }]));
      const loaded = loadSampleData();
      expect(loaded).toBe(false);
    });
  });

  describe('hasSampleData', () => {
    it('should return false when no data exists', () => {
      expect(hasSampleData()).toBe(false);
    });

    it('should return true after loading sample data', () => {
      loadSampleData();
      expect(hasSampleData()).toBe(true);
    });

    it('should return false for non-demo data', () => {
      localStorage.setItem('cognisync_journal_entries', JSON.stringify([{ id: 'real_1' }]));
      expect(hasSampleData()).toBe(false);
    });
  });
});
