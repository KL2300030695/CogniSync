import { describe, it, expect } from 'vitest';
import { analyzeLocalSentiment, getTrendDirection } from '../ai/sentiment-analyzer';

describe('Sentiment Analyzer', () => {
  describe('analyzeLocalSentiment', () => {
    it('should return neutral score for empty text', () => {
      const result = analyzeLocalSentiment('');
      expect(result.score).toBe(0.5);
      expect(result.emotion).toBe('calm');
      expect(result.keywords).toEqual([]);
    });

    it('should detect positive sentiment', () => {
      const result = analyzeLocalSentiment('I had a wonderful happy day with my beautiful family. We were laughing together.');
      expect(result.score).toBeGreaterThan(0.6);
      expect(['happy', 'content']).toContain(result.emotion);
    });

    it('should detect negative sentiment', () => {
      const result = analyzeLocalSentiment('I feel very sad and lonely today. Everything seems dark and tired.');
      expect(result.score).toBeLessThan(0.4);
      expect(['sad', 'anxious', 'confused']).toContain(result.emotion);
    });

    it('should detect mixed sentiment', () => {
      const result = analyzeLocalSentiment('I miss my garden but the sunshine today was nice.');
      expect(result.score).toBeGreaterThan(0.3);
      expect(result.score).toBeLessThan(0.8);
    });

    it('should extract keywords', () => {
      const result = analyzeLocalSentiment('Margaret took me to the beautiful garden. We saw flowers and birds.');
      expect(result.keywords.length).toBeGreaterThan(0);
    });

    it('should detect concern patterns - spatial disorientation', () => {
      const result = analyzeLocalSentiment("I don't know where I am. Everything looks strange.");
      expect(result.concerns.length).toBeGreaterThan(0);
      expect(result.concerns[0]).toContain('disorientation');
    });

    it('should detect concern patterns - temporal disorientation', () => {
      const result = analyzeLocalSentiment('What day is it? I thought it was Monday.');
      expect(result.concerns.length).toBeGreaterThan(0);
      expect(result.concerns[0]).toContain('disorientation');
    });

    it('should detect urgent self-harm concerns', () => {
      const result = analyzeLocalSentiment('I want to die. There is no point anymore.');
      expect(result.concerns.length).toBeGreaterThan(0);
      expect(result.concerns.some(c => c.includes('URGENT'))).toBe(true);
    });

    it('should return clarity score', () => {
      const result = analyzeLocalSentiment('I went to the park with Margaret yesterday. We saw three robins near the old oak tree.');
      expect(result.clarity).toBeGreaterThan(0);
      expect(result.clarity).toBeLessThanOrEqual(100);
    });

    it('should provide a summary', () => {
      const result = analyzeLocalSentiment('Today was a good day.');
      expect(result.summary).toBeDefined();
      expect(result.summary.length).toBeGreaterThan(0);
    });

    it('should handle special characters gracefully', () => {
      const result = analyzeLocalSentiment('Hello!!! ??? ... @#$%');
      expect(result).toBeDefined();
      expect(result.score).toBeDefined();
    });

    it('should handle very long text', () => {
      const longText = 'I remember the beautiful garden. '.repeat(100);
      const result = analyzeLocalSentiment(longText);
      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThan(0.5);
    });
  });

  describe('getTrendDirection', () => {
    it('should return stable for no data', () => {
      expect(getTrendDirection([])).toBe('stable');
    });

    it('should return stable for single value', () => {
      expect(getTrendDirection([50])).toBe('stable');
    });

    it('should detect improving trend', () => {
      const scores = [30, 35, 40, 55, 60, 70];
      expect(getTrendDirection(scores)).toBe('improving');
    });

    it('should detect declining trend', () => {
      const scores = [70, 65, 60, 40, 35, 30];
      expect(getTrendDirection(scores)).toBe('declining');
    });

    it('should detect stable trend', () => {
      const scores = [50, 51, 49, 50, 51, 50];
      expect(getTrendDirection(scores)).toBe('stable');
    });
  });
});
