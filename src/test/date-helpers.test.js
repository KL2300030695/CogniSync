import { describe, it, expect } from 'vitest';
import { formatTime, formatDate, formatChartDate, isSameDay, getRelativeTime, getGreeting, getLastNDays } from '../utils/date-helpers';

describe('Date Helpers', () => {
  describe('formatTime', () => {
    it('should format timestamp to 12-hour time', () => {
      const result = formatTime('2026-04-17T14:30:00Z');
      expect(result).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/i);
    });

    it('should handle midnight', () => {
      const midnight = new Date();
      midnight.setHours(0, 0, 0, 0);
      const result = formatTime(midnight.toISOString());
      expect(result).toMatch(/12:00\s*AM/i);
    });
  });

  describe('formatDate', () => {
    it('should return "Today" for today\'s date', () => {
      const result = formatDate(new Date().toISOString());
      expect(result).toBe('Today');
    });

    it('should return "Yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = formatDate(yesterday.toISOString());
      expect(result).toBe('Yesterday');
    });

    it('should format older dates with weekday', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10);
      const result = formatDate(oldDate.toISOString());
      expect(result).not.toBe('Today');
      expect(result).not.toBe('Yesterday');
      expect(result.length).toBeGreaterThan(3);
    });
  });

  describe('formatChartDate', () => {
    it('should format date for chart labels', () => {
      const result = formatChartDate('2026-04-17T10:00:00Z');
      expect(result).toMatch(/Apr\s+17/);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const d1 = new Date(2026, 3, 17, 10, 0);
      const d2 = new Date(2026, 3, 17, 22, 0);
      expect(isSameDay(d1, d2)).toBe(true);
    });

    it('should return false for different days', () => {
      const d1 = new Date(2026, 3, 17);
      const d2 = new Date(2026, 3, 18);
      expect(isSameDay(d1, d2)).toBe(false);
    });
  });

  describe('getRelativeTime', () => {
    it('should return "Just now" for recent timestamps', () => {
      const result = getRelativeTime(new Date().toISOString());
      expect(result).toBe('Just now');
    });

    it('should return minutes for recent past', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();
      const result = getRelativeTime(fiveMinAgo);
      expect(result).toMatch(/\d+m ago/);
    });

    it('should return hours for same day', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
      const result = getRelativeTime(threeHoursAgo);
      expect(result).toMatch(/\d+h ago/);
    });
  });

  describe('getGreeting', () => {
    it('should return a greeting string', () => {
      const result = getGreeting();
      expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(result);
    });
  });

  describe('getLastNDays', () => {
    it('should return correct number of days', () => {
      const days = getLastNDays(7);
      expect(days).toHaveLength(7);
    });

    it('should end with today', () => {
      const days = getLastNDays(7);
      const today = new Date().toISOString().split('T')[0];
      expect(days[days.length - 1]).toBe(today);
    });

    it('should be in chronological order', () => {
      const days = getLastNDays(7);
      for (let i = 1; i < days.length; i++) {
        expect(new Date(days[i]).getTime()).toBeGreaterThan(new Date(days[i - 1]).getTime());
      }
    });
  });
});
