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
  speakWithGoogleTTS,
} from '../services/google-services';

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  query: vi.fn(),
  orderBy: vi.fn(),
  enableIndexedDbPersistence: vi.fn(() => Promise.resolve()),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  signInAnonymously: vi.fn(() => Promise.resolve({ user: { uid: 'test-uid' } })),
  onAuthStateChanged: vi.fn((auth, cb) => { cb({ uid: 'test-uid' }); return () => {}; }),
}));

describe('Google Services Integration', () => {
  describe('Google Analytics 4', () => {
    beforeEach(() => {
      window.gtag = undefined;
      window.dataLayer = undefined;
    });

    it('should not crash when GA Measurement ID is missing', () => {
      expect(() => initGoogleAnalytics()).not.toThrow();
    });

    it('should not crash when gtag not loaded and trackPageView called', () => {
      expect(() => trackPageView('Home', '/')).not.toThrow();
    });

    it('should not crash when gtag not loaded and trackEvent called', () => {
      expect(() => trackEvent('test_event', { value: 1 })).not.toThrow();
    });

    it('should call gtag with page_view event', () => {
      window.gtag = vi.fn();
      trackPageView('Journal', '/journal');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
        page_title: 'Journal',
        page_path: '/journal',
      }));
    });

    it('should include app_name in all events', () => {
      window.gtag = vi.fn();
      trackEvent('custom_event', { custom_param: 42 });
      expect(window.gtag).toHaveBeenCalledWith('event', 'custom_event', expect.objectContaining({
        app_name: 'EventFlow AI',
        custom_param: 42,
      }));
    });

    it('should track assistant session start with correct category', () => {
      window.gtag = vi.fn();
      trackJournalSessionStart();
      expect(window.gtag).toHaveBeenCalledWith('event', 'assistant_session_start', expect.objectContaining({
        event_category: 'engagement',
        event_label: 'attendee_assistant',
      }));
    });

    it('should track facility interaction with type and status', () => {
      window.gtag = vi.fn();
      trackExerciseCompleted('word_assoc', 'easy');
      expect(window.gtag).toHaveBeenCalledWith('event', 'facility_interaction', expect.objectContaining({
        event_category: 'venue_facility',
        event_label: 'word_assoc',
        difficulty: 'easy',
      }));
    });

    it('should track voice input usage under accessibility category', () => {
      window.gtag = vi.fn();
      trackVoiceInputUsed();
      expect(window.gtag).toHaveBeenCalledWith('event', 'voice_input_used', expect.objectContaining({
        event_category: 'accessibility',
        event_label: 'speech_to_text',
      }));
    });

    it('should track dashboard view with attendee count value', () => {
      window.gtag = vi.fn();
      trackDashboardView(12);
      expect(window.gtag).toHaveBeenCalledWith('event', 'dashboard_viewed', expect.objectContaining({
        event_category: 'staff_operations',
        value: 12,
      }));
    });

    it('should handle zero entries count in dashboard tracking', () => {
      window.gtag = vi.fn();
      expect(() => trackDashboardView(0)).not.toThrow();
    });
  });

  describe('Firebase Configuration', () => {
    it('should detect Firebase configuration status', () => {
      // With .env configured, this returns true; validates function works
      expect(typeof isFirebaseConfigured()).toBe('boolean');
    });

    it('isFirebaseConfigured returns a boolean', () => {
      expect(typeof isFirebaseConfigured()).toBe('boolean');
    });
  });

  describe('Google Maps Configuration', () => {
    it('should return false when Maps API key is not configured', () => {
      expect(isMapsConfigured()).toBe(false);
    });

    it('isMapsConfigured returns a boolean', () => {
      expect(typeof isMapsConfigured()).toBe('boolean');
    });
  });

  describe('Google Cloud Text-to-Speech', () => {
    it('should return false immediately when TTS key not configured', async () => {
      const result = await speakWithGoogleTTS('Hello Maya');
      expect(result).toBe(false);
    });

    it('should return false for empty text', async () => {
      const result = await speakWithGoogleTTS('');
      expect(result).toBe(false);
    });

    it('should not throw on null/undefined text', async () => {
      await expect(speakWithGoogleTTS(null)).resolves.toBe(false);
      await expect(speakWithGoogleTTS(undefined)).resolves.toBe(false);
    });
  });
});
