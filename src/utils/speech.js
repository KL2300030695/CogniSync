/**
 * CogniSync Web Speech API Helpers
 * Voice input/output for patient-friendly interaction
 */

let recognition = null;
let isListening = false;

/**
 * Check if Web Speech API is supported
 */
export function isSpeechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Check if Speech Synthesis is supported
 */
export function isSynthesisSupported() {
  return !!window.speechSynthesis;
}

/**
 * Start listening for voice input
 */
export function startListening(onResult, onError, onEnd) {
  if (!isSpeechSupported()) {
    onError?.('Speech recognition is not supported in this browser. Please use Chrome.');
    return false;
  }

  if (isListening) {
    stopListening();
    return false;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  let finalTranscript = '';
  let interimTranscript = '';

  recognition.onstart = () => {
    isListening = true;
  };

  recognition.onresult = (event) => {
    interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript = transcript;
      }
    }
    onResult?.({
      final: finalTranscript.trim(),
      interim: interimTranscript,
      combined: (finalTranscript + interimTranscript).trim(),
    });
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech') return; // Normal - no speech detected
    if (event.error === 'aborted') return; // Normal - manually stopped
    onError?.(event.error);
  };

  recognition.onend = () => {
    isListening = false;
    onEnd?.(finalTranscript.trim());
  };

  try {
    recognition.start();
    return true;
  } catch (e) {
    onError?.(e.message);
    return false;
  }
}

/**
 * Stop listening
 */
export function stopListening() {
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {
      // Already stopped
    }
    isListening = false;
  }
}

/**
 * Get current listening state
 */
export function getListeningState() {
  return isListening;
}

/**
 * Speak text aloud (Maya's voice)
 */
export function speak(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!isSynthesisSupported()) {
      reject('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure for warm, gentle voice
    utterance.rate = options.rate || 0.85; // Slightly slower for clarity
    utterance.pitch = options.pitch || 1.1; // Slightly higher for warmth
    utterance.volume = options.volume || 0.9;

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Zira') ||
      (v.lang === 'en-US' && v.name.includes('Female'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop speaking
 */
export function stopSpeaking() {
  if (isSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
