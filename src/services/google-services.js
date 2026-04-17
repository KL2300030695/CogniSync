/**
 * CogniSync Google Services Integration
 *
 * Integrates multiple Google services:
 *   - Google Analytics (gtag.js) — usage tracking
 *   - Firebase Firestore — optional cloud backup
 *   - Google Maps Places API — care facility finder
 *   - Google Cloud Text-to-Speech — enhanced Maya voice
 */

// ============================================
// Google Analytics (gtag.js)
// ============================================

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

export function initGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_title: 'CogniSync',
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });
}

export function trackPageView(pageName, pagePath) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_path: pagePath,
    });
  }
}

export function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      app_name: 'CogniSync',
    });
  }
}

export function trackJournalSessionStart() {
  trackEvent('journal_session_start', {
    event_category: 'engagement',
    event_label: 'patient_journal',
  });
}

export function trackExerciseCompleted(exerciseType, difficulty) {
  trackEvent('exercise_completed', {
    event_category: 'cognitive_exercise',
    event_label: exerciseType,
    difficulty,
  });
}

export function trackVoiceInputUsed() {
  trackEvent('voice_input_used', {
    event_category: 'accessibility',
    event_label: 'speech_to_text',
  });
}

export function trackDashboardView(entriesCount) {
  trackEvent('dashboard_viewed', {
    event_category: 'caregiver',
    event_label: 'family_dashboard',
    value: entriesCount,
  });
}

// ============================================
// Firebase Firestore (optional cloud backup)
// To enable: npm install firebase and set env vars
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.
// ============================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export function isFirebaseConfigured() {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
}

/**
 * Initialize Firebase cloud sync (requires firebase npm package)
 * Run: npm install firebase  to enable this feature
 */
export async function initFirebase() {
  if (!isFirebaseConfigured()) {
    console.info('CogniSync: Firebase not configured — using localStorage (fully private mode).');
    return null;
  }
  console.info('CogniSync: Firebase config detected. Install firebase SDK to enable cloud sync.');
  return null;
}

/**
 * Sync entries to Firestore (stub — enable by installing firebase SDK)
 */
export async function syncToFirestore(_entries, _patientId = 'default') {
  return false;
}

/**
 * Fetch entries from Firestore (stub — enable by installing firebase SDK)
 */
export async function fetchFromFirestore(_patientId = 'default') {
  return [];
}

// ============================================
// Google Maps Places API (care facility finder)
// ============================================

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

export function isMapsConfigured() {
  return !!MAPS_API_KEY;
}

export function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (!MAPS_API_KEY) {
      reject('Google Maps API key not configured');
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
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject('Failed to load Google Maps');
    document.head.appendChild(script);
  });
}

export async function findNearbyCareFacilities(latitude, longitude) {
  if (!window.google?.maps) return [];

  return new Promise((resolve) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );
    service.nearbySearch({
      location: { lat: latitude, lng: longitude },
      radius: 10000,
      type: 'health',
      keyword: 'memory care dementia alzheimer',
    }, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(results.map(place => ({
          name: place.name,
          address: place.vicinity,
          rating: place.rating,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        })));
      } else {
        resolve([]);
      }
    });
  });
}

// ============================================
// Google Cloud Text-to-Speech (enhanced Maya voice)
// ============================================

const TTS_API_KEY = import.meta.env.VITE_GOOGLE_TTS_KEY || '';

export async function speakWithGoogleTTS(text) {
  if (!TTS_API_KEY) return false;

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
            speakingRate: 0.9,
            pitch: 1.5,
          },
        }),
      }
    );

    const data = await response.json();
    if (data.audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      await audio.play();
      return true;
    }
  } catch (error) {
    console.warn('Google TTS fallback to browser speech:', error.message);
  }
  return false;
}
