/**
 * EventFlow AI Gemini Client
 * Wrapper for Google Gemini API with fallback to mock responses.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { MAYA_SYSTEM_PROMPT, SENTIMENT_ANALYSIS_PROMPT, CLARITY_ASSESSMENT_PROMPT, MEMORY_EXTRACTION_PROMPT, JOURNAL_SUMMARY_PROMPT } from './prompts';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let chatSession = null;
let conversationHistory = [];

/**
 * Initialize the Gemini client
 */
function getClient() {
  if (!genAI && API_KEY && API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

/**
 * Get or create a chat session with Maya's personality
 */
function getChatSession(patientName = 'friend') {
  const client = getClient();
  if (!client) return null;

  if (!chatSession) {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const personalizedPrompt = MAYA_SYSTEM_PROMPT.replace(
      /the patient/g, 
      patientName !== 'friend' ? patientName : 'the patient'
    );

    chatSession = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `System instruction: ${personalizedPrompt}\n\nPlease acknowledge and begin acting as Maya.` }],
        },
        {
          role: 'model', 
          parts: [{ text: `Hello! I'm Maya, and I'm so glad to be here with you today 🌸 Take your time — there's absolutely no rush. How has your day been so far?` }],
        },
        ...conversationHistory,
      ],
    });
  }
  return chatSession;
}

/**
 * Send a message to Maya and get a response
 */
export async function sendMessageToMaya(message, patientName = 'friend') {
  const session = getChatSession(patientName);
  
  if (!session) {
    // Fallback to mock response if no API key
    return getMockMayaResponse(message);
  }

  try {
    const result = await session.sendMessage(message);
    const response = result.response.text();
    
    // Store in history for context
    conversationHistory.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: response }] }
    );
    
    return response;
  } catch (error) {
    console.error('Gemini API error:', error);
    return getMockMayaResponse(message);
  }
}

/**
 * Analyze sentiment of a journal entry
 */
export async function analyzeSentiment(text) {
  const client = getClient();
  
  if (!client) {
    return getMockSentiment(text);
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(
      `${SENTIMENT_ANALYSIS_PROMPT}\n\nPatient entry: "${text}"`
    );
    const response = result.response.text();
    
    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getMockSentiment(text);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return getMockSentiment(text);
  }
}

/**
 * Assess clarity of a journal entry
 */
export async function assessClarity(text) {
  const client = getClient();
  
  if (!client) {
    return getMockClarity(text);
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(
      `${CLARITY_ASSESSMENT_PROMPT}\n\nPatient entry: "${text}"`
    );
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getMockClarity(text);
  } catch (error) {
    console.error('Clarity assessment error:', error);
    return getMockClarity(text);
  }
}

/**
 * Extract memories from text
 */
export async function extractMemories(text) {
  const client = getClient();
  
  if (!client) {
    return getMockMemories(text);
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(
      `${MEMORY_EXTRACTION_PROMPT}\n\nPatient entry: "${text}"`
    );
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getMockMemories(text);
  } catch (error) {
    console.error('Memory extraction error:', error);
    return getMockMemories(text);
  }
}

/**
 * Generate journal summary for family dashboard
 */
export async function generateJournalSummary(conversationText) {
  const client = getClient();
  
  if (!client) {
    return {
      summary: "The patient had a calm and pleasant conversation today, discussing fond memories.",
      topicsDiscussed: ["daily activities", "family memories"],
      memoriesRecalled: ["childhood home", "family gatherings"],
      mood: "content",
      flags: []
    };
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(
      `${JOURNAL_SUMMARY_PROMPT}\n\nConversation:\n${conversationText}`
    );
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Summary generation error:', error);
  }
  
  return {
    summary: "Journal session completed successfully.",
    topicsDiscussed: [],
    memoriesRecalled: [],
    mood: "neutral",
    flags: []
  };
}

/**
 * Reset the chat session (for new conversations)
 */
export function resetChatSession() {
  chatSession = null;
  conversationHistory = [];
}

/**
 * Check if API is configured
 */
export function isApiConfigured() {
  return !!(API_KEY && API_KEY !== 'your_gemini_api_key_here');
}

// ============================================
// Mock Responses (fallback when no API key)
// ============================================

const MOCK_RESPONSES = [
  "That's such a lovely thought! 🌸 Tell me, what does that remind you of?",
  "How wonderful! I can almost picture it. What sounds do you remember from that time?",
  "That sounds like a really special memory. Who was with you? 💛",
  "Take your time — there's no rush at all. What feels most vivid about that?",
  "I love hearing about this! What was the weather like that day? ☀️",
  "That's so interesting! What was your favorite part about it?",
  "What a beautiful memory to share. Does it remind you of anyone special?",
  "How sweet! Was there a particular smell or taste that goes with that memory?",
  "I appreciate you telling me about this. What happened next? 🎵",
  "That sounds absolutely wonderful. How did it make you feel?"
];

function getMockMayaResponse(message) {
  const idx = Math.floor(Math.random() * MOCK_RESPONSES.length);
  return MOCK_RESPONSES[idx];
}

function getMockSentiment(text) {
  const words = text.toLowerCase();
  let score = 0.5;
  
  if (words.match(/happy|joy|love|wonderful|great|smile|laugh|beautiful/)) score = 0.8;
  if (words.match(/sad|miss|lonely|worried|confused|scared|tired/)) score = 0.3;
  if (words.match(/angry|frustrated|hate|terrible|awful/)) score = 0.15;
  if (words.match(/calm|peaceful|nice|good|fine/)) score = 0.65;
  
  const emotions = { 0.15: 'frustrated', 0.3: 'sad', 0.5: 'calm', 0.65: 'content', 0.8: 'happy' };
  const closestKey = Object.keys(emotions).reduce((a, b) => 
    Math.abs(b - score) < Math.abs(a - score) ? b : a
  );
  
  return {
    score,
    emotion: emotions[closestKey],
    keywords: text.split(' ').filter(w => w.length > 4).slice(0, 5),
    clarity: Math.floor(50 + Math.random() * 40),
    concerns: [],
    summary: `Patient appears ${emotions[closestKey]} during this entry.`
  };
}

function getMockClarity(text) {
  const wordCount = text.split(' ').length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  
  const structure = Math.min(25, Math.floor(15 + (avgSentenceLength > 3 ? 10 : 0)));
  const coherence = Math.min(25, Math.floor(10 + Math.random() * 15));
  const specificity = Math.min(25, Math.floor(8 + Math.random() * 17));
  const engagement = Math.min(25, Math.floor(12 + Math.random() * 13));
  
  return {
    score: structure + coherence + specificity + engagement,
    breakdown: { structure, coherence, specificity, engagement },
    notes: "Assessment generated from text analysis."
  };
}

function getMockMemories(text) {
  return {
    people: text.match(/\b[A-Z][a-z]+\b/g)?.slice(0, 3) || [],
    places: [],
    events: [],
    timeReferences: text.match(/\b(morning|evening|yesterday|today|last|ago)\b/gi) || [],
    emotions: [],
    sensoryDetails: []
  };
}
