/**
 * EventFlow AI Sentiment Analyzer
 * Client-side keyword-based sentiment analysis for attendee feedback.
 */

const POSITIVE_WORDS = new Set([
  'happy', 'joy', 'love', 'wonderful', 'great', 'smile', 'laugh', 'beautiful',
  'amazing', 'gorgeous', 'delightful', 'pleasant', 'peaceful', 'calm', 'nice',
  'good', 'fun', 'enjoy', 'grateful', 'thankful', 'blessed', 'proud', 'excited',
  'warm', 'cozy', 'lovely', 'sweet', 'kind', 'gentle', 'bright', 'sunshine',
  'friend', 'family', 'together', 'celebrate', 'dance', 'sing', 'music', 'garden',
  'flower', 'cook', 'bake', 'remember', 'cherish', 'treasure'
]);

const NEGATIVE_WORDS = new Set([
  'sad', 'miss', 'lonely', 'worried', 'confused', 'scared', 'tired', 'pain',
  'angry', 'frustrated', 'hate', 'terrible', 'awful', 'lost', 'afraid',
  'dark', 'cold', 'alone', 'forget', 'forgot', 'cannot', 'difficult', 'hard',
  'hurt', 'cry', 'tears', 'broken', 'empty', 'gone', 'never', 'dying',
  'sick', 'hospital', 'medicine', 'doctor'
]);

const CONCERN_PATTERNS = [
  { pattern: /don'?t know where i am/i, concern: 'Spatial disorientation mentioned' },
  { pattern: /what day is it/i, concern: 'Temporal disorientation mentioned' },
  { pattern: /who are you/i, concern: 'Person recognition difficulty' },
  { pattern: /want to die|kill myself|end it/i, concern: 'URGENT: Self-harm ideation detected' },
  { pattern: /can'?t remember anything/i, concern: 'Expressed significant memory frustration' },
  { pattern: /lost|losing|lose my mind/i, concern: 'Expressed fear of cognitive decline' },
  { pattern: /nobody|no one|alone/i, concern: 'Feelings of isolation expressed' },
];

/**
 * Analyze sentiment of text using keyword scoring
 * @param {string} text 
 * @returns {{ score: number, emotion: string, keywords: string[], clarity: number, concerns: string[], summary: string }}
 */
export function analyzeLocalSentiment(text) {
  if (!text || text.trim().length === 0) {
    return {
      score: 0.5,
      emotion: 'calm',
      keywords: [],
      clarity: 50,
      concerns: [],
      summary: 'No content to analyze.'
    };
  }

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  const extractedKeywords = [];

  words.forEach(word => {
    const clean = word.replace(/[^a-z]/g, '');
    if (POSITIVE_WORDS.has(clean)) {
      positiveCount++;
      extractedKeywords.push(clean);
    }
    if (NEGATIVE_WORDS.has(clean)) {
      negativeCount++;
      extractedKeywords.push(clean);
    }
  });

  // Calculate score
  const total = positiveCount + negativeCount;
  let score = 0.5;
  if (total > 0) {
    score = positiveCount / total;
  }
  // Normalize to 0.1 - 0.9 range
  score = 0.1 + score * 0.8;

  // Detect concerns
  const concerns = [];
  CONCERN_PATTERNS.forEach(({ pattern, concern }) => {
    if (pattern.test(text)) {
      concerns.push(concern);
    }
  });

  // Determine emotion
  let emotion = 'calm';
  if (score > 0.7) emotion = 'happy';
  else if (score > 0.6) emotion = 'content';
  else if (score > 0.4) emotion = 'calm';
  else if (score > 0.3) emotion = 'nostalgic';
  else if (score > 0.2) emotion = 'sad';
  else emotion = 'anxious';

  if (concerns.length > 0) {
    emotion = 'confused';
    score = Math.min(score, 0.35);
  }

  // Assess clarity
  const clarity = assessLocalClarity(text);

  // Extract meaningful keywords (nouns, proper names)
  const significantWords = words
    .filter(w => w.length > 4 && !POSITIVE_WORDS.has(w) && !NEGATIVE_WORDS.has(w))
    .filter((w, i, arr) => arr.indexOf(w) === i)
    .slice(0, 8);

  return {
    score: Math.round(score * 100) / 100,
    emotion,
    keywords: [...new Set([...extractedKeywords, ...significantWords])].slice(0, 10),
    clarity,
    concerns,
    summary: `Patient appears ${emotion}. Sentiment score: ${Math.round(score * 100)}%.${concerns.length > 0 ? ` ${concerns.length} concern(s) noted.` : ''}`
  };
}

/**
 * Assess text clarity locally (backup)
 */
function assessLocalClarity(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  // Structure: Are there proper sentences?
  const structure = Math.min(25, sentences.length > 0 ? 15 + Math.min(10, sentences.length * 2) : 5);
  
  // Coherence: Average sentence length (too short or too long = less coherent)
  const avgLen = sentences.length > 0 ? words.length / sentences.length : 0;
  const coherence = Math.min(25, avgLen > 3 && avgLen < 20 ? 20 : 10);
  
  // Specificity: Presence of proper nouns, numbers, specific details
  const properNouns = (text.match(/\b[A-Z][a-z]{2,}\b/g) || []).length;
  const numbers = (text.match(/\d+/g) || []).length;
  const specificity = Math.min(25, 10 + Math.min(15, (properNouns + numbers) * 3));
  
  // Engagement: Length and emotional content
  const engagement = Math.min(25, 10 + Math.min(15, Math.floor(words.length / 5)));

  return structure + coherence + specificity + engagement;
}

/**
 * Get trend direction from an array of scores
 */
export function getTrendDirection(scores) {
  if (scores.length < 2) return 'stable';
  
  const recent = scores.slice(-3);
  const older = scores.slice(-6, -3);
  
  if (older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 5) return 'improving';
  if (diff < -5) return 'declining';
  return 'stable';
}
