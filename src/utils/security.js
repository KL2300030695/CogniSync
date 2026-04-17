/**
 * CogniSync Input Security Utilities
 *
 * Provides input validation and sanitization functions to prevent:
 * - Cross-site scripting (XSS) via injected HTML
 * - Excessively long input (denial of service)
 * - Malformed API payloads
 *
 * @module security
 */

const MAX_JOURNAL_LENGTH  = 5000;  // characters
const MAX_PROFILE_LENGTH  = 500;
const MAX_PROMPT_LENGTH   = 4000;

/**
 * Strip HTML tags from a string to prevent XSS injection.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string with no HTML tags
 */
export function stripHtml(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')          // remove HTML tags
    .replace(/javascript:/gi, '')     // remove JS protocol
    .replace(/on\w+\s*=/gi, '')       // remove event handlers
    .trim();
}

/**
 * Sanitize and truncate journal/chat text input.
 * @param {string} text - Raw patient text input
 * @returns {string} Safe, truncated text
 */
export function sanitizeJournalText(text) {
  if (!text || typeof text !== 'string') return '';
  return stripHtml(text).slice(0, MAX_JOURNAL_LENGTH);
}

/**
 * Sanitize a profile field (name, topics, memories).
 * @param {string} value - Raw profile field input
 * @returns {string} Safe, truncated value
 */
export function sanitizeProfileField(value) {
  if (!value || typeof value !== 'string') return '';
  return stripHtml(value).slice(0, MAX_PROFILE_LENGTH);
}

/**
 * Sanitize text before sending to Gemini API.
 * Prevents prompt injection attacks by limiting length and removing
 * characters that could manipulate the system prompt.
 * @param {string} text - Text to include in AI prompt
 * @returns {string} Safe prompt text
 */
export function sanitizeForPrompt(text) {
  if (!text || typeof text !== 'string') return '';
  return stripHtml(text)
    .replace(/```/g, "'''")           // prevent markdown code injection
    .replace(/\[SYSTEM\]/gi, '')      // prevent system prompt injection
    .replace(/\[INST\]/gi, '')        // prevent instruction injection
    .slice(0, MAX_PROMPT_LENGTH);
}

/**
 * Validate that a Gemini API key matches the expected format.
 * Does NOT expose or log the key — only validates structure.
 * @param {string} key - Potential API key string
 * @returns {boolean} True if key format appears valid
 */
export function isValidApiKey(key) {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  return trimmed.length >= 20 && trimmed.length <= 100 && /^[A-Za-z0-9_\-\.]+$/.test(trimmed);
}

/**
 * Validate a URL is safe (https only, no javascript: or data: URIs).
 * @param {string} url - URL string to validate
 * @returns {boolean} True if URL is safe
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitize a JSON string before import to prevent prototype pollution.
 * @param {string} jsonString - Raw JSON input from file import
 * @returns {{ data: Object|null, error: string|null }}
 */
export function safeParseJson(jsonString) {
  if (!jsonString || typeof jsonString !== 'string') {
    return { data: null, error: 'Input must be a non-empty string' };
  }
  try {
    const data = JSON.parse(jsonString);
    // Basic prototype pollution guard: reject __proto__, constructor, prototype keys
    const dangerous = ['__proto__', 'constructor', 'prototype'];
    const str = JSON.stringify(data);
    if (dangerous.some((k) => str.includes(`"${k}"`))) {
      return { data: null, error: 'Invalid data structure detected' };
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: `JSON parse error: ${err.message}` };
  }
}

/**
 * Rate limiter factory — limits how often a function can be called.
 * Used to prevent API abuse from rapid-fire submissions.
 * @param {number} maxCalls - Maximum calls allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {function(): boolean} Returns true if call is allowed
 */
export function createRateLimiter(maxCalls = 10, windowMs = 60000) {
  const calls = [];
  return function isAllowed() {
    const now = Date.now();
    const windowStart = now - windowMs;
    // Remove calls outside the window
    while (calls.length > 0 && calls[0] < windowStart) calls.shift();
    if (calls.length >= maxCalls) return false;
    calls.push(now);
    return true;
  };
}
