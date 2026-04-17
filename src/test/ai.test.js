import { describe, it, expect } from 'vitest';
import { isApiConfigured } from '../ai/gemini-client';
import { MAYA_SYSTEM_PROMPT, SENTIMENT_ANALYSIS_PROMPT, CLARITY_ASSESSMENT_PROMPT, MEMORY_EXTRACTION_PROMPT, EXERCISE_GENERATION_PROMPT, JOURNAL_SUMMARY_PROMPT } from '../ai/prompts';

describe('AI Prompts', () => {
  describe('Maya System Prompt', () => {
    it('should contain empathetic personality traits', () => {
      expect(MAYA_SYSTEM_PROMPT).toContain('WARM');
      expect(MAYA_SYSTEM_PROMPT).toContain('KIND');
      expect(MAYA_SYSTEM_PROMPT).toContain('PATIENT');
    });

    it('should contain safety guardrails', () => {
      expect(MAYA_SYSTEM_PROMPT).toContain('NEVER diagnose');
      expect(MAYA_SYSTEM_PROMPT).toContain('NEVER express frustration');
      expect(MAYA_SYSTEM_PROMPT).toContain('NEVER say things like');
    });

    it('should include communication guidelines', () => {
      expect(MAYA_SYSTEM_PROMPT).toContain('short, clear sentences');
      expect(MAYA_SYSTEM_PROMPT).toContain('ONE question at a time');
    });

    it('should include conversation starters', () => {
      expect(MAYA_SYSTEM_PROMPT).toContain('Conversation Starters');
    });

    it('should include memory handling rules', () => {
      expect(MAYA_SYSTEM_PROMPT).toContain('NEVER correct a memory');
    });
  });

  describe('Sentiment Analysis Prompt', () => {
    it('should request JSON output format', () => {
      expect(SENTIMENT_ANALYSIS_PROMPT).toContain('JSON');
      expect(SENTIMENT_ANALYSIS_PROMPT).toContain('score');
      expect(SENTIMENT_ANALYSIS_PROMPT).toContain('emotion');
      expect(SENTIMENT_ANALYSIS_PROMPT).toContain('keywords');
    });

    it('should include emotion categories', () => {
      expect(SENTIMENT_ANALYSIS_PROMPT).toContain('happy');
      expect(SENTIMENT_ANALYSIS_PROMPT).toContain('sad');
      expect(SENTIMENT_ANALYSIS_PROMPT).toContain('confused');
    });
  });

  describe('Clarity Assessment Prompt', () => {
    it('should include scoring criteria', () => {
      expect(CLARITY_ASSESSMENT_PROMPT).toContain('structure');
      expect(CLARITY_ASSESSMENT_PROMPT).toContain('coherence');
      expect(CLARITY_ASSESSMENT_PROMPT).toContain('specificity');
      expect(CLARITY_ASSESSMENT_PROMPT).toContain('engagement');
    });

    it('should define score range 0-100', () => {
      expect(CLARITY_ASSESSMENT_PROMPT).toContain('0-100');
    });
  });

  describe('Memory Extraction Prompt', () => {
    it('should request structured memory data', () => {
      expect(MEMORY_EXTRACTION_PROMPT).toContain('people');
      expect(MEMORY_EXTRACTION_PROMPT).toContain('places');
      expect(MEMORY_EXTRACTION_PROMPT).toContain('events');
      expect(MEMORY_EXTRACTION_PROMPT).toContain('emotions');
    });
  });

  describe('Exercise Generation Prompt', () => {
    it('should define exercise parameters', () => {
      expect(EXERCISE_GENERATION_PROMPT).toContain('title');
      expect(EXERCISE_GENERATION_PROMPT).toContain('difficulty');
      expect(EXERCISE_GENERATION_PROMPT).toContain('Non-frustrating');
    });
  });

  describe('Journal Summary Prompt', () => {
    it('should request caregiver-friendly format', () => {
      expect(JOURNAL_SUMMARY_PROMPT).toContain('family');
      expect(JOURNAL_SUMMARY_PROMPT).toContain('summary');
      expect(JOURNAL_SUMMARY_PROMPT).toContain('flags');
    });
  });
});

describe('Gemini Client', () => {
  describe('isApiConfigured', () => {
    it('should return a boolean', () => {
      const result = isApiConfigured();
      expect(typeof result).toBe('boolean');
    });
  });
});
