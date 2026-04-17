import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] || null,
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock SpeechRecognition
window.SpeechRecognition = window.webkitSpeechRecognition = class {
  start() {}
  stop() {}
  addEventListener() {}
};

// Mock SpeechSynthesis
window.speechSynthesis = {
  speak: () => {},
  cancel: () => {},
  getVoices: () => [],
};

// Mock SpeechSynthesisUtterance
window.SpeechSynthesisUtterance = class {
  constructor() {
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
  }
};
