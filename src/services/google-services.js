/**
 * CogniSync — Google Services Integration Module
 *
 * Integrates 6 Google services:
 *  1. Google Gemini AI         — AI conversation & analysis
 *  2. Google Analytics 4       — anonymized usage tracking (HIPAA-conscious)
 *  3. Firebase Firestore       — optional encrypted cloud backup
 *  4. Firebase Authentication  — anonymous auth for Firestore security
 *  5. Google Maps Places API   — nearby care facility discovery
 *  6. Google Cloud TTS         — enhanced Maya voice (Neural2-F)
 *
 * @module google-services
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';

// ─────────────────────────────────────────────
// 1. Google Analytics 4 (gtag.js)
// ─────────────────────────────────────────────

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

/**
 * Initialize Google Analytics 4 with privacy-safe configuration.
 * Only loads if VITE_GA_MEASUREMENT_ID is set.
 * Uses anonymize_ip for HIPAA-conscious tracking.
 */
export function initGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); } // eslint-disable-line prefer-rest-params
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_title: 'CogniSync',
    anonymize_ip: true,         // HIPAA-conscious: no raw IP stored
    cookie_flags: 'SameSite=None;Secure',
  });
}

/**
 * Track a page view in Google Analytics.
 * @param {string} pageName - Human-readable page name
 * @param {string} pagePath - URL path (e.g. '/journal')
 */
export function trackPageView(pageName, pagePath) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_path: pagePath,
    });
  }
}

/**
 * Track a custom analytics event.
 * @param {string} eventName - GA4 event name (snake_case)
 * @param {Object} params - Additional event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      app_name: 'CogniSync',
    });
  }
}

/** Track patient journal session start. */
export function trackJournalSessionStart() {
  trackEvent('journal_session_start', {
    event_category: 'engagement',
    event_label: 'patient_journal',
  });
}

/**
 * Track cognitive exercise completion.
 * @param {string} exerciseType - Exercise ID (e.g. 'word_assoc')
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 */
export function trackExerciseCompleted(exerciseType, difficulty) {
  trackEvent('exercise_completed', {
    event_category: 'cognitive_exercise',
    event_label: exerciseType,
    difficulty,
  });
}

/** Track voice input usage (accessibility metric). */
export function trackVoiceInputUsed() {
  trackEvent('voice_input_used', {
    event_category: 'accessibility',
    event_label: 'speech_to_text',
  });
}

/**
 * Track family dashboard view.
 * @param {number} entriesCount - Number of journal entries visible
 */
export function trackDashboardView(entriesCount) {
  trackEvent('dashboard_viewed', {
    event_category: 'caregiver',
    event_label: 'family_dashboard',
    value: entriesCount,
  });
}

// ─────────────────────────────────────────────
// 2. Firebase (Firestore + Authentication)
// ─────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '',
};

let _db = null;
let _auth = null;
let _currentUser = null;

/**
 * Check whether Firebase environment variables are configured.
 * @returns {boolean}
 */
export function isFirebaseConfigured() {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
}

/**
 * Initialize Firebase app, Firestore, and anonymous auth.
 * Enables offline persistence so Firestore works without network.
 * @returns {import('firebase/firestore').Firestore|null}
 */
export async function initFirebase() {
  if (!isFirebaseConfigured()) {
    console.info('CogniSync: Firebase not configured — using localStorage (privacy-first mode).');
    return null;
  }

  try {
    // Prevent re-initialization on hot reload
    const app = getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApps()[0];

    _db = getFirestore(app);
    _auth = getAuth(app);

    // Enable offline persistence (Firestore works without internet)
    try {
      await enableIndexedDbPersistence(_db);
    } catch (err) {
      if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
        console.warn('Firestore offline persistence:', err.message);
      }
    }

    // Sign in anonymously so Firestore security rules can scope data
    await signInAnonymously(_auth);
    onAuthStateChanged(_auth, (user) => { _currentUser = user; });

    console.info('CogniSync: Firebase initialized with offline persistence + anonymous auth.');
    return _db;
  } catch (error) {
    console.warn('CogniSync: Firebase init failed, using localStorage fallback.', error.message);
    return null;
  }
}

/**
 * Save a single journal entry to Firestore.
 * Data is scoped under the anonymous user's UID for security.
 * @param {Object} entry - Journal entry object (must have `id` field)
 * @param {string} [patientId='default'] - Patient identifier
 * @returns {Promise<boolean>} - true if saved successfully
 */
export async function saveEntryToFirestore(entry, patientId = 'default') {
  if (!_db || !entry?.id) return false;

  try {
    const uid = _currentUser?.uid || patientId;
    await setDoc(
      doc(_db, 'patients', uid, 'journal_entries', entry.id),
      { ...entry, syncedAt: new Date().toISOString() }
    );
    return true;
  } catch (error) {
    console.error('CogniSync: Firestore save error:', error.message);
    return false;
  }
}

/**
 * Sync multiple journal entries to Firestore.
 * @param {Object[]} entries - Array of journal entries
 * @param {string} [patientId='default'] - Patient identifier
 * @returns {Promise<boolean>}
 */
export async function syncToFirestore(entries, patientId = 'default') {
  if (!_db) return false;

  try {
    const uid = _currentUser?.uid || patientId;
    const writes = entries.map((entry) =>
      setDoc(
        doc(_db, 'patients', uid, 'journal_entries', entry.id),
        { ...entry, syncedAt: new Date().toISOString() }
      )
    );
    await Promise.all(writes);
    return true;
  } catch (error) {
    console.error('CogniSync: Firestore sync error:', error.message);
    return false;
  }
}

/**
 * Fetch all journal entries from Firestore, ordered by timestamp.
 * @param {string} [patientId='default'] - Patient identifier
 * @returns {Promise<Object[]>} - Array of journal entries
 */
export async function fetchFromFirestore(patientId = 'default') {
  if (!_db) return [];

  try {
    const uid = _currentUser?.uid || patientId;
    const q = query(
      collection(_db, 'patients', uid, 'journal_entries'),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data());
  } catch (error) {
    console.error('CogniSync: Firestore fetch error:', error.message);
    return [];
  }
}

// ─────────────────────────────────────────────
// 3. Google Maps Places API
// ─────────────────────────────────────────────

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

/**
 * Check whether Google Maps API key is configured.
 * @returns {boolean}
 */
export function isMapsConfigured() {
  return !!MAPS_API_KEY;
}

/**
 * Dynamically load the Google Maps JavaScript SDK.
 * @returns {Promise<object>} Resolves with window.google.maps
 */
export function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (!MAPS_API_KEY) {
      reject(new Error('Google Maps API key not configured'));
      return;
    }
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload  = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Failed to load Google Maps SDK'));
    document.head.appendChild(script);
  });
}

/**
 * Search for nearby memory care / dementia care facilities.
 * Uses Google Maps Places API nearbySearch.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object[]>} Array of facility objects
 */
export async function findNearbyCareFacilities(latitude, longitude) {
  if (!window.google?.maps) return [];

  return new Promise((resolve) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(
      {
        location: { lat: latitude, lng: longitude },
        radius: 10000,
        type: 'health',
        keyword: 'memory care dementia alzheimer',
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(
            results.map((place) => ({
              name:     place.name,
              address:  place.vicinity,
              rating:   place.rating,
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            }))
          );
        } else {
          resolve([]);
        }
      }
    );
  });
}

// ─────────────────────────────────────────────
// 4. Google Cloud Text-to-Speech (Neural2-F)
// ─────────────────────────────────────────────

const TTS_API_KEY = import.meta.env.VITE_GOOGLE_TTS_KEY || '';

/**
 * Synthesize speech via Google Cloud TTS Neural2-F voice.
 * Falls back silently to browser Speech Synthesis if not configured.
 * @param {string} text - Text to speak aloud
 * @returns {Promise<boolean>} - true if Google TTS was used
 */
export async function speakWithGoogleTTS(text) {
  if (!TTS_API_KEY || !text) return false;

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TTS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-F',
            ssmlGender: 'FEMALE',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.9,   // slightly slower for elderly users
            pitch: 1.5,          // warmer tone
          },
        }),
      }
    );

    if (!response.ok) throw new Error(`TTS HTTP ${response.status}`);
    const data = await response.json();

    if (data.audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      await audio.play();
      return true;
    }
  } catch (error) {
    console.warn('CogniSync: Google TTS unavailable, using browser synthesis.', error.message);
  }
  return false;
}
