import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initGoogleAnalytics,
  trackPageView,
  trackEvent,
  trackJournalSessionStart,
  trackExerciseCompleted,
  trackVoiceInputUsed,
  trackDashboardView,
  isFirebaseConfigured,
  isMapsConfigured,
} from '../services/google-services';

describe('Google Services Integration', () => {
  describe('Google Analytics', () => {
    beforeEach(() => {
      window.gtag = undefined;
      window.dataLayer = undefined;
    });

    it('should not crash when GA is not configured', () => {
      expect(() => initGoogleAnalytics()).not.toThrow();
    });

    it('should handle trackPageView when gtag not loaded', () => {
      expect(() => trackPageView('Home', '/')).not.toThrow();
    });

    it('should handle trackEvent when gtag not loaded', () => {
      expect(() => trackEvent('test_event', { value: 1 })).not.toThrow();
    });

    it('should call gtag when available', () => {
      window.gtag = vi.fn();
      trackPageView('Home', '/');
      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
        page_title: 'Home',
        page_path: '/',
      }));
    });

    it('should track journal session start', () => {
      window.gtag = vi.fn();
      trackJournalSessionStart();
      expect(window.gtag).toHaveBeenCalledWith('event', 'journal_session_start', expect.objectContaining({
        event_category: 'engagement',
      }));
    });

    it('should track exercise completed', () => {
      window.gtag = vi.fn();
      trackExerciseCompleted('word_association', 'easy');
      expect(window.gtag).toHaveBeenCalledWith('event', 'exercise_completed', expect.objectContaining({
        event_category: 'cognitive_exercise',
        event_label: 'word_association',
        difficulty: 'easy',
      }));
    });

    it('should track voice input usage', () => {
      window.gtag = vi.fn();
      trackVoiceInputUsed();
      expect(window.gtag).toHaveBeenCalledWith('event', 'voice_input_used', expect.objectContaining({
        event_category: 'accessibility',
      }));
    });

    it('should track dashboard view', () => {
      window.gtag = vi.fn();
      trackDashboardView(7);
      expect(window.gtag).toHaveBeenCalledWith('event', 'dashboard_viewed', expect.objectContaining({
        event_category: 'caregiver',
        value: 7,
      }));
    });

    it('should include app_name in all tracked events', () => {
      window.gtag = vi.fn();
      trackEvent('custom_event', { custom: 'value' });
      expect(window.gtag).toHaveBeenCalledWith('event', 'custom_event', expect.objectContaining({
        app_name: 'CogniSync',
        custom: 'value',
      }));
    });
  });

  describe('Firebase Configuration', () => {
    it('should return false when Firebase is not configured', () => {
      expect(isFirebaseConfigured()).toBe(false);
    });
  });

  describe('Google Maps Configuration', () => {
    it('should return false when Maps API is not configured', () => {
      expect(isMapsConfigured()).toBe(false);
    });
  });
});
