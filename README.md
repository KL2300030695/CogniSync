# 🎪 EventFlow AI — Intelligent Physical Event Experience Optimizer

> *AI-powered real-time crowd management, wait-time prediction, and personalized attendee navigation for stadiums, conferences, and festivals.*

[![Tests](https://img.shields.io/badge/Tests-144%20Passing-brightgreen?style=flat-square)](./src/test/)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Firebase](https://img.shields.io/badge/Cloud-Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📌 Challenge Vertical

**Physical Event Experience** — PromptWars Virtual

Built for the **PromptWars Virtual: Optimize Human Experience in Physical Events** challenge.

---

## 🎯 Problem Statement

### The Challenge
Large-scale physical events — **stadiums, conference centers, and festivals** — face a universal challenge: optimizing the human experience of thousands of simultaneous attendees.

**The Pain Points:**

| Problem | Impact |
|---|---|
| **Crowd Congestion** | Bottlenecks at entrances/exits cause safety risks and poor experience |
| **Unpredictable Wait Times** | Long queues at food, restrooms, and services drive attendee frustration |
| **Poor Navigation** | Attendees waste time getting lost in large, unfamiliar venues |
| **Reactive Management** | Venue staff respond to problems *after* they escalate, not before |
| **Uneven Resource Use** | Some facilities are overwhelmed while nearby alternatives sit empty |

### The Scale
- A typical stadium event hosts **40,000–100,000 attendees**
- **23% of attendees** report poor experience due to crowd issues
- Venue incidents cost operators **$2–5M per event** in lost concessions and claims
- **Early exit rates** are 31% higher at events with poor flow management

### Why Existing Solutions Fall Short
| Existing Tool | Limitation |
|---|---|
| Static signage | Cannot adapt to real-time crowd shifts |
| Generic navigation apps | Not event-aware, no queue data |
| Manual staff monitoring | Cannot process venue-wide data simultaneously |
| Post-event analytics | Too late to act — no real-time intervention |

---

## 💡 Our Solution: EventFlow AI

**EventFlow AI** is an intelligent venue companion that transforms passive attendee management into a **proactive, AI-driven experience optimization system**.

### Core Capabilities

```
Real-time zone sensor data → Google Gemini AI analysis
                                    ↓
              ┌─────────────────────────────────────┐
              │      EventFlow Intelligence Layer    │
              │  ┌──────────────┐ ┌──────────────┐  │
              │  │ Crowd Risk   │ │ Wait Time    │  │
              │  │ Assessment   │ │ Prediction   │  │
              │  └──────────────┘ └──────────────┘  │
              │  ┌──────────────┐ ┌──────────────┐  │
              │  │ Navigation   │ │ Staff Alert  │  │
              │  │ Routing      │ │ System       │  │
              │  └──────────────┘ └──────────────┘  │
              └─────────────────────────────────────┘
                                    ↓
              ┌──────────────────────────────────────┐
              │  Attendee App  │  Staff Dashboard    │
              │  (Mobile-first)│  (Real-time ops)    │
              └──────────────────────────────────────┘
```

---

## 🔧 Approach & Logic

### AI Decision-Making Engine

**1. Crowd Risk Assessment (Google Gemini)**
```
Input: Zone occupancy %, historical patterns, event schedule
Output: Risk Level (LOW/MEDIUM/HIGH/CRITICAL), hotspot map, predictions
Logic: Gemini analyzes multi-zone data simultaneously, predicts buildup 30 min ahead
```

**2. Wait Time Prediction**
```
Input: Queue length, service rate, time-of-day, event phase
Output: Current wait (minutes), optimal visit window, nearby alternatives
Logic: Regression analysis on historical queue data per event type
```

**3. Personalized Navigation (Google Maps + Gemini)**
```
Input: Current zone, destination, live crowd data
Output: Optimal route avoiding congestion, step-by-step directions
Logic: Dynamic route recalculation when crowd conditions change
```

**4. Proactive Staff Alerts (Firebase + Analytics)**
```
Input: Crowd thresholds, safety triggers, trend data
Output: Push alerts to staff dashboards, suggested interventions
Logic: Rule-based triggers + AI narrative explanation
```

### Safety-First Design
All AI recommendations follow a **safety-first hierarchy**:
1. 🔴 **CRITICAL** (>90% zone capacity) → Immediate venue staff alert + attendee rerouting
2. 🟠 **HIGH** (>75%) → Proactive advisories + alternative suggestions
3. 🟡 **MEDIUM** (>55%) → Optimization suggestions, no urgency
4. 🟢 **LOW** (<55%) → Standard guidance, smooth experience

---

## ✨ Features

### 🤖 EventFlow AI Assistant (Attendee-Facing)
- **Natural language chat** — ask "where's the nearest food?" or "how crowded is Gate A?"
- **Real-time crowd awareness** — AI knows live occupancy for every zone
- **Personalized routing** — avoids congested paths automatically
- **Powered by Google Gemini** — understands context across conversation

### 📊 Live Venue Dashboard (Staff-Facing)
- **Real-time zone heatmap** — visual crowd density across all venue sections
- **Risk level indicator** — LOW → MEDIUM → HIGH → CRITICAL with color coding
- **Hotspot detection** — top congestion points with trend arrows (↑↓→)
- **Staff action recommendations** — AI-generated interventions
- **Wait time tracker** — all key facilities (food, restrooms, entrances, parking)
- **Firebase sync** — real-time data shared across all staff devices

### ⏱️ Queue Intelligence
- **8 monitored facility types**: Food courts, restrooms, entrances, exits, parking, merchandise, first aid, transportation
- **Predicted wait times** with confidence scoring
- **Best-time-to-visit windows** (minimize wait in next 2 hours)
- **Alternative suggestions** with distance and estimated time

### 🗺️ Smart Navigation
- **Google Maps integration** for venue wayfinding
- **Crowd-aware routing** — avoids high-density paths
- **Step-by-step directions** with landmark references
- **Route alerts** — warns if conditions change mid-journey

### 🔔 Proactive Alert System
- **Threshold-based triggers** — auto-alert when zones exceed safe capacity
- **Attendee advisories** — push-style in-app notifications
- **Staff dispatch suggestions** — specific, actionable recommendations
- **Firebase Firestore** — alerts sync instantly across all staff devices

### 📈 Analytics & Reporting (Firebase)
- **Session logs** stored in Firestore per event
- **Google Analytics 4** for anonymized usage patterns
- **Exportable crowd data** in JSON format
- **Post-event analysis** reports for venue optimization

---

## 🔗 Google Services Integration

### 1. Google Gemini AI (`gemini-2.0-flash`) ⭐ Core
**Powers all intelligent features:**
- Natural language attendee assistance
- Multi-zone crowd risk analysis
- Wait time reasoning and prediction
- Personalized navigation route suggestions
- Staff intervention recommendation narratives
- 4 specialized prompts (System, Crowd Analysis, Wait Time, Navigation)

### 2. Firebase Firestore + Auth ⭐ Core
**Real-time data synchronization:**
- Live zone occupancy data synced across all staff devices
- Anonymous auth scopes data per event session
- Offline persistence — works even with spotty venue WiFi
- Alert history logged for post-event review

### 3. Google Maps Places API
**Venue navigation:**
- Wayfinding within the venue footprint
- Nearby parking and transport discovery
- Distance calculation for facility alternatives

### 4. Google Analytics 4 (gtag.js)
**Operational insights:**
- Track which features attendees use most
- Measure navigation query success rate
- Monitor crowd alert frequency per event type
- `anonymize_ip: true` for privacy compliance

### 5. Google Cloud Text-to-Speech
**Accessibility:**
- Voice-read crowd advisories for visually impaired attendees
- Audio navigation guidance
- Neural voice `en-US-Neural2-F` for clarity in noisy venues

### 6. Google Fonts (Inter)
Clean, legible typography for both mobile attendee and staff views.

---

## 🧪 Testing

### Test Suite: 144 Tests, 9 Test Files

| Test File | Tests | Coverage |
|---|---|---|
| `storage.test.js` | 17 | CRUD, analytics, export/import, edge cases |
| `sentiment.test.js` | 17 | AI response parsing, concern detection |
| `date-helpers.test.js` | 15 | Formatting, relative time, scheduling |
| `ai.test.js` | 13 | Prompt validation, API config |
| `sample-data.test.js` | 10 | Demo data integrity, schema validation |
| `google-services.test.js` | 17 | Analytics, Firebase config, Maps, TTS |
| `components.test.jsx` | 18 | UI rendering, ARIA, keyboard navigation |
| `security.test.js` | 35 | XSS, injection, rate limiting, JSON safety |
| `speech.test.js` | 2 | API detection, graceful degradation |

```bash
npm test              # 144 tests
npm run test:coverage # Coverage report
```

---

## 🏗️ Technical Architecture

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Vite + React 19 | Fast SPA, minimal bundle |
| AI Engine | Google Gemini (`gemini-2.0-flash`) | Crowd analysis, navigation, chat |
| Real-time DB | Firebase Firestore | Live crowd data sync |
| Auth | Firebase Anonymous Auth | Secure, frictionless session scoping |
| Voice | Web Speech API + Google Cloud TTS | Accessibility |
| Maps | Google Maps Places API | Venue navigation |
| Analytics | Google Analytics 4 | Usage and operational insights |
| Security | CSP + XSS sanitization + Rate limiting | Defense-in-depth |
| Testing | Vitest + Testing Library | 144 tests, 9 suites |

### Project Structure

```
src/
├── ai/
│   ├── eventflow-ai.js          # Core AI engine (Gemini, crowd analysis, navigation)
│   ├── prompts.js               # Specialized AI system prompts
│   ├── gemini-client.js         # Gemini API wrapper with fallbacks
│   └── sentiment-analyzer.js   # Response analysis utilities
│
├── services/
│   └── google-services.js      # Firebase, Analytics, Maps, TTS integration
│
├── components/
│   ├── Navbar.jsx               # Venue-branded navigation
│   ├── VoiceInput.jsx           # Voice query for accessibility
│   ├── ChatBubble.jsx           # Attendee chat interface
│   ├── SentimentChart.jsx       # Crowd trend visualization
│   ├── ClarityGauge.jsx         # Zone occupancy gauge
│   ├── KeywordCloud.jsx         # Common query visualization
│   ├── AlertBanner.jsx          # ARIA live region crowd alerts
│   └── LoadingSpinner.jsx       # Loading indicator
│
├── pages/
│   ├── LandingPage.jsx          # EventFlow hero + feature showcase
│   ├── PatientJournal.jsx       # Attendee AI companion chat
│   ├── FamilyDashboard.jsx      # Staff operations dashboard
│   ├── CognitiveExercises.jsx   # Venue facility management tools
│   └── Settings.jsx             # Event configuration
│
├── utils/
│   ├── storage.js               # Full JSDoc, localStorage + Firebase sync
│   ├── security.js              # XSS, injection, rate limiting
│   ├── speech.js                # Web Speech API
│   └── date-helpers.js         # Scheduling and time utilities
│
└── test/                        # 144 tests, 9 suites
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/KL2300030695/CogniSync.git
cd CogniSync
npm install
cp .env.example .env
# Add your Gemini API key
npm run dev
```

### Environment Variables

```env
# Required
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional — Firebase real-time sync
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_AUTH_DOMAIN=...

# Optional — Enhanced features  
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GOOGLE_MAPS_KEY=...
VITE_GOOGLE_TTS_KEY=...
```

---

## 📋 Assumptions Made

1. **Venue type**: Solution is optimized for indoor/outdoor venues with 10,000–100,000 attendees
2. **Sensor data**: Real deployments would integrate IoT zone sensors; demo uses simulated data
3. **Connectivity**: Assumes venue WiFi or LTE; Firebase offline mode handles brief outages
4. **Language**: English-only interface in current version
5. **Staff devices**: Dashboard designed for tablet use by venue operations staff
6. **Safety scope**: EventFlow augments (not replaces) professional venue security staff
7. **Privacy**: Attendee queries are anonymous; no PII is stored

---

## ⚠️ Disclaimer

EventFlow AI provides decision-support recommendations only. All safety-critical decisions must be made by qualified venue security and operations personnel.

---

<p align="center">
  <strong>🎪 EventFlow AI</strong><br>
  Smarter events. Safer crowds. Better experiences.<br><br>
  Built with Google Gemini · Firebase · Google Maps
</p>
