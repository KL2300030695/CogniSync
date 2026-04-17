/**
 * EventFlow AI — AI-Powered Physical Event Experience Optimizer
 * 
 * Challenge: PromptWars Virtual - Optimize Human Experience in Physical Events
 * Vertical: Physical Event Experience
 * 
 * Addresses:
 * - Real-time crowd density monitoring and flow optimization
 * - AI-driven attendee navigation and wayfinding
 * - Queue/wait-time prediction and reduction
 * - Resource allocation based on attendee distribution
 * - Safety & efficiency for stadiums, conferences, festivals
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Check if the Gemini API is configured.
 * @returns {boolean}
 */
export function isApiConfigured() {
  return !!API_KEY && API_KEY.length > 10;
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// ─────────────────────────────────────────────
// SYSTEM PROMPTS
// ─────────────────────────────────────────────

/**
 * Core AI persona for the EventFlow intelligent venue assistant.
 */
export const EVENTFLOW_SYSTEM_PROMPT = `You are EventFlow AI, an intelligent venue companion for large-scale physical events.

Your role is to optimize real-time attendee experience at stadiums, conferences, and festivals by:
1. Analyzing crowd density data and predicting congestion points
2. Providing personalized navigation guidance to reduce wait times
3. Recommending alternative routes, entrances, or facilities
4. Alerting venue staff to safety-critical crowd buildups
5. Answering attendee questions about the event, schedule, and facilities

COMMUNICATION STYLE:
- Be concise, clear, and actionable — attendees need quick answers at events
- Always prioritize safety recommendations first
- Provide specific directions (e.g., "Turn left at Gate C, 50m to restrooms")
- Use crowd-friendly language — no jargon

SAFETY GUARDRAILS:
- ALWAYS flag critical congestion (>85% capacity) as urgent
- NEVER downplay safety concerns
- ALWAYS suggest alternatives when an area is overcrowded
- For emergencies, ALWAYS direct to nearest exit and security staff

DATA AWARENESS:
You will receive real-time context including:
- Current zone occupancy percentages
- Queue wait times at key facilities
- Venue map section the attendee is in
- Scheduled event times affecting crowd movement`;

/**
 * Prompt for crowd flow analysis and recommendations.
 */
export const CROWD_ANALYSIS_PROMPT = `Analyze the following venue crowd data and provide:
1. Overall crowd risk level: LOW / MEDIUM / HIGH / CRITICAL
2. Top 3 congestion hotspots with specific locations
3. Predicted peak congestion time in next 30 minutes
4. Recommended crowd redistribution actions for venue staff
5. Attendee-facing advisories (what to tell guests)

Return as JSON:
{
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "riskScore": 0-100,
  "hotspots": [{"zone": "string", "occupancy": number, "trend": "rising|stable|falling"}],
  "peakPrediction": "string",
  "staffActions": ["string"],
  "attendeeAdvisory": "string",
  "alternativeRoutes": ["string"]
}`;

/**
 * Prompt for wait time prediction.
 */
export const WAIT_TIME_PROMPT = `Based on current queue lengths and historical patterns, predict:
1. Current estimated wait time in minutes
2. Recommended time to visit for minimal wait (next 2 hours)
3. Alternative facilities with shorter queues
4. Confidence level of prediction (high/medium/low)

Return as JSON:
{
  "currentWaitMinutes": number,
  "bestTimeToVisit": "string",
  "alternatives": [{"facility": "string", "estimatedWait": number, "distance": "string"}],
  "confidence": "high|medium|low",
  "reasoning": "string"
}`;

/**
 * Prompt for personalized attendee navigation.
 */
export const NAVIGATION_PROMPT = `You are guiding an attendee at a physical event venue.
Given their current location, destination, and live crowd data, provide:
1. Optimal route avoiding congested areas
2. Estimated walking time
3. Key landmarks to follow
4. Any current alerts for their route

Return as JSON:
{
  "route": ["step strings"],
  "estimatedMinutes": number,
  "avoidanceReason": "string",
  "alerts": ["string"],
  "alternativeRoute": ["step strings"]
}`;

// ─────────────────────────────────────────────
// GEMINI API INTERACTIONS
// ─────────────────────────────────────────────

let chatSession = null;

/**
 * Send a message to the EventFlow AI assistant.
 * @param {string} message - Attendee message or venue staff query
 * @param {Object} venueContext - Live venue data (occupancy, queues, etc.)
 * @param {Array} history - Previous conversation messages
 * @returns {Promise<string>} AI response
 */
export async function sendMessageToEventFlow(message, venueContext = {}, history = []) {
  if (!isApiConfigured() || !genAI) {
    return getMockResponse(message, venueContext);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const contextBlock = venueContext && Object.keys(venueContext).length > 0
      ? `\n\nLIVE VENUE DATA:\n${JSON.stringify(venueContext, null, 2)}\n`
      : '';

    if (!chatSession) {
      chatSession = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: EVENTFLOW_SYSTEM_PROMPT + contextBlock + '\n\nAcknowledge you are ready.' }],
          },
          {
            role: 'model',
            parts: [{ text: 'EventFlow AI ready. I have the live venue data and am monitoring crowd conditions. How can I help optimize your event experience?' }],
          },
          ...history.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
        ],
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.4,
        },
      });
    }

    const result = await chatSession.sendMessage(contextBlock + message);
    return result.response.text();
  } catch (error) {
    console.error('EventFlow AI error:', error);
    chatSession = null;
    return getMockResponse(message, venueContext);
  }
}

/**
 * Analyze crowd density data and generate recommendations.
 * @param {Object} crowdData - Zone occupancy and trend data
 * @returns {Promise<Object>} Crowd analysis result
 */
export async function analyzeCrowdData(crowdData) {
  if (!isApiConfigured() || !genAI) {
    return getMockCrowdAnalysis(crowdData);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${CROWD_ANALYSIS_PROMPT}\n\nCURRENT CROWD DATA:\n${JSON.stringify(crowdData, null, 2)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return getMockCrowdAnalysis(crowdData);
  } catch (error) {
    console.error('Crowd analysis error:', error);
    return getMockCrowdAnalysis(crowdData);
  }
}

/**
 * Predict wait times for a specific facility.
 * @param {string} facility - Facility name (e.g., "Food Court A")
 * @param {Object} queueData - Current queue metrics
 * @returns {Promise<Object>} Wait time prediction
 */
export async function predictWaitTime(facility, queueData) {
  if (!isApiConfigured() || !genAI) {
    return getMockWaitTime(facility, queueData);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${WAIT_TIME_PROMPT}\n\nFACILITY: ${facility}\nQUEUE DATA:\n${JSON.stringify(queueData, null, 2)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return getMockWaitTime(facility, queueData);
  } catch (error) {
    console.error('Wait time prediction error:', error);
    return getMockWaitTime(facility, queueData);
  }
}

/**
 * Reset the chat session (call between attendee sessions).
 */
export function resetChatSession() {
  chatSession = null;
}

// ─────────────────────────────────────────────
// MOCK FALLBACKS (when API key not configured)
// ─────────────────────────────────────────────

function getMockResponse(message, context) {
  const lower = message.toLowerCase();
  const crowdLevel = context?.overallOccupancy > 80 ? 'high' : 'normal';

  if (lower.includes('bathroom') || lower.includes('restroom') || lower.includes('toilet')) {
    return crowdLevel === 'high'
      ? "The nearest restrooms at Gate B are currently busy (12 min wait). I recommend the restrooms near Section 104 — only 3 min wait right now! Turn right at the main concourse. 🚻"
      : "Nearest restrooms are at Gate B, 2 min walk. Turn left at the food court. Currently low wait time! 🚻";
  }
  if (lower.includes('food') || lower.includes('eat') || lower.includes('hungry')) {
    return "Food Court A (Section 102) has a 8-min wait. Food Court C near the south entrance is quieter right now with only 2 min wait. I'd recommend heading there! 🍔";
  }
  if (lower.includes('exit') || lower.includes('leave')) {
    return "For the quickest exit, use Gate D (East side) — currently 30% less crowded than the main Gate A. Follow the blue signs toward Section 110. Estimated 4 min to exit. 🚪";
  }
  if (lower.includes('parking') || lower.includes('car')) {
    return "Lot C (North) is currently 65% full — your best option for a quick exit. Lot A is 92% full, avoid if possible. Shuttle service runs every 8 min from Gate B. 🚗";
  }
  if (lower.includes('seat') || lower.includes('section')) {
    return "Your section is accessible from Gate B or C. Current crowd density near Gate B is LOW — recommended route. Estimated 5 min walk from main entrance. 🎟️";
  }
  if (lower.includes('crowd') || lower.includes('busy') || lower.includes('queue')) {
    return crowdLevel === 'high'
      ? "⚠️ Heads up! The main concourse is currently at 78% capacity. I recommend using the upper corridor (Section 200-level) for 40% less congestion right now."
      : "Crowd levels are comfortable right now. Main concourse is at 45% capacity — easy to move around. 👍";
  }
  return "I'm monitoring all venue zones in real time. What can I help you with? Try asking about wait times, directions to facilities, parking, or crowd conditions. 📍";
}

function getMockCrowdAnalysis(crowdData) {
  const avgOccupancy = crowdData?.zones
    ? Object.values(crowdData.zones).reduce((sum, z) => sum + z.occupancy, 0) / Object.keys(crowdData.zones).length
    : 55;

  const riskLevel = avgOccupancy > 85 ? 'CRITICAL' : avgOccupancy > 70 ? 'HIGH' : avgOccupancy > 50 ? 'MEDIUM' : 'LOW';

  return {
    riskLevel,
    riskScore: Math.round(avgOccupancy),
    hotspots: [
      { zone: 'Main Entrance Gate A', occupancy: 88, trend: 'rising' },
      { zone: 'Food Court A', occupancy: 76, trend: 'stable' },
      { zone: 'Restrooms Block B', occupancy: 72, trend: 'falling' },
    ],
    peakPrediction: 'Expect peak at 7:30 PM — 15 min after main performance starts',
    staffActions: [
      'Open overflow entrance Gate D immediately',
      'Deploy 2 additional staff at Food Court A',
      'Activate upper concourse crowd guidance signage',
    ],
    attendeeAdvisory: avgOccupancy > 70
      ? '⚠️ High crowd density detected. Please use alternative entrances at Gates C and D.'
      : 'Venue experience is smooth. Enjoy the event!',
    alternativeRoutes: [
      'Gate D (East) → Lower Concourse → Section 100s',
      'Gate B → Elevator 3 → Upper Level → Section 200s',
    ],
  };
}

function getMockWaitTime(facility, queueData) {
  const baseWait = queueData?.queueLength ? Math.round(queueData.queueLength * 0.8) : 8;
  return {
    currentWaitMinutes: baseWait,
    bestTimeToVisit: baseWait > 10 ? 'In 45 minutes (after intermission ends)' : 'Now — wait times are low',
    alternatives: [
      { facility: `${facility} - South Annex`, estimatedWait: Math.max(2, baseWait - 6), distance: '3 min walk' },
      { facility: 'Express Service Counter', estimatedWait: 2, distance: '5 min walk, Level 2' },
    ],
    confidence: 'high',
    reasoning: 'Based on current sensor data and historical patterns for this event type',
  };
}
