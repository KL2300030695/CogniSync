import { describe, it, expect } from 'vitest';
import { isSpeechSupported, isSynthesisSupported } from '../utils/speech';

describe('Speech Utilities', () => {
  describe('isSpeechSupported', () => {
    it('should return true when SpeechRecognition is available', () => {
      expect(isSpeechSupported()).toBe(true);
    });
  });

  describe('isSynthesisSupported', () => {
    it('should return true when speechSynthesis is available', () => {
      expect(isSynthesisSupported()).toBe(true);
    });
  });
});
