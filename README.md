# 🧠 CogniSync — AI-Powered Memory Care Companion

> *Empowering families to provide better care for loved ones with Alzheimer's and Dementia through AI-driven cognitive engagement and real-time health analytics.*

[![Tests](https://img.shields.io/badge/Tests-103%20Passing-brightgreen?style=flat-square)](./src/test/)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Firebase](https://img.shields.io/badge/Cloud-Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📌 Chosen Vertical

**Healthcare & Wellness — Cognitive Memory Care Assistant**

CogniSync is an intelligent, voice-enabled AI assistant designed for the **healthcare persona**, targeting the real-world challenge of dementia and Alzheimer's care. It serves patients through empathetic AI conversation and family caregivers through actionable cognitive health analytics.

---

## 🎯 Problem Statement

### The Challenge
Over **55 million people** worldwide live with dementia, and this number is projected to reach 139 million by 2050. Families caring for loved ones with early-stage Alzheimer's face three critical gaps:

1. **Cognitive Engagement Gap** — Patients need daily mental stimulation, but caregivers lack the time, tools, and training to provide structured cognitive exercises
2. **Monitoring Gap** — Cognitive decline is gradual and difficult to track without clinical tools. By the time families notice a change, valuable intervention time has often been lost
3. **Accessibility Gap** — Existing tools are either clinical (requiring professional setup) or too complex for elderly users with reduced motor/visual capability

### The Stakes
- **70% of caregivers** report burnout from the constant demands of memory care
- **Early cognitive intervention** can delay the onset of severe dementia by 1–3 years
- **Only 16%** of primary care physicians routinely screen for cognitive impairment

### Why Existing Solutions Fall Short
| Existing Solution | Limitation |
|---|---|
| Clinical assessment tools | Require professional administration, expensive |
| Generic chatbots | No empathy protocols, not designed for cognitive fragility |
| Caregiver journals (paper) | No pattern analysis, no alerts, not scalable |
| Meditation/wellness apps | Not designed for dementia; no family visibility |

---

## 💡 Our Solution

**CogniSync** is an AI-powered memory care companion that bridges all three gaps:

```
Patient speaks/types
        ↓
Maya (Google Gemini AI) responds with empathy
        ↓
Parallel analysis pipeline:
  ├─ Sentiment scoring (happiness, anxiety, confusion)
  ├─ Cognitive clarity assessment (0–100 scale)
  ├─ Memory keyword extraction (people, places, events)
  └─ Concern detection (disorientation, distress signals)
        ↓
Results saved locally + optionally synced to Firebase
        ↓
Family dashboard: trends, alerts, insights
```

### Core Value Proposition
- **For patients**: A warm, infinitely patient AI companion available 24/7, accessible via voice
- **For families**: Data-driven insights without clinical overhead — monitoring from home
- **For healthcare**: A bridge tool that generates structured conversation data that can inform clinical visits

---

## 🏗️ Technical Architecture

### System Design
```
┌─────────────────────────────────────────────────────┐
│                   CogniSync Frontend                │
│                  (React 19 + Vite)                  │
├──────────────┬──────────────────┬───────────────────┤
│  Patient UI  │  Caregiver UI   │  Exercise Engine   │
│  (Warm Mode) │  (Dashboard)    │  (8 exercises)     │
├──────────────┴──────────────────┴───────────────────┤
│              Google Services Layer                  │
│  ┌─────────┐ ┌──────────┐ ┌──────┐ ┌────────────┐  │
│  │ Gemini  │ │Firebase  │ │Maps  │ │ Analytics  │  │
│  │  AI     │ │Firestore │ │Places│ │  (gtag)    │  │
│  └─────────┘ └──────────┘ └──────┘ └────────────┘  │
├─────────────────────────────────────────────────────┤
│           Privacy Layer (localStorage)              │
│        All data on-device by default                │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Vite + React 19** | Fast development, minimal bundle size |
| AI Conversation | **Google Gemini** (`gemini-2.0-flash`) | Empathetic patient conversations |
| AI Analysis | **Google Gemini** (6 specialized prompts) | Sentiment, clarity, memory extraction |
| Cloud Database | **Firebase Firestore** | Optional encrypted cloud backup |
| Voice I/O | **Web Speech API** + **Google Cloud TTS** | Browser-native + enhanced voice |
| Maps | **Google Maps Places API** | Nearby care facility discovery |
| Analytics | **Google Analytics 4** (gtag.js) | Anonymized usage tracking |
| Charts | **Chart.js + react-chartjs-2** | Sentiment & clarity visualizations |
| Typography | **Google Fonts** (Inter + Merriweather) | Accessible, readable typography |
| CSS | **Vanilla CSS** | Glassmorphism design system |
| Storage | **localStorage** (primary) + Firebase (optional) | Privacy-first with cloud fallback |
| Testing | **Vitest + Testing Library** | 103 tests, 8 test suites |

---

## 🔧 Approach & Logic

### AI Prompt Engineering (Core Innovation)

Maya's intelligence comes from 6 carefully engineered system prompts:

| Prompt | Input | Output | Purpose |
|---|---|---|---|
| **Maya Persona** | System config | Personality constraints | Ensures empathy, safety, patience |
| **Sentiment Analysis** | Patient text | `{score, emotion, keywords}` | Track emotional wellbeing |
| **Clarity Assessment** | Patient text | `{score, breakdown}` | Measure cognitive coherence |
| **Memory Extraction** | Conversation | `{people, places, events}` | Build memory keyword map |
| **Exercise Generation** | Context | `{exercises[]}` | Create adaptive brain games |
| **Journal Summary** | Full session | `{summary, flags}` | Brief for family caregivers |

### Safety Guardrails (Ethical AI Design)
Maya's system prompt enforces **mandatory safety rules**:
- ❌ NEVER diagnose, assess, or mention cognitive decline
- ❌ NEVER express impatience, frustration, or repetition fatigue
- ❌ NEVER correct a patient's memory (even if factually wrong)
- ✅ ALWAYS redirect gently when distress is detected
- ✅ ALWAYS use simple, clear language (max 2 sentences per response)
- ✅ ALWAYS end with a gentle question to maintain engagement

### Cognitive Decline Detection Algorithm
```javascript
// Client-side sentiment analysis (fallback)
score = (positiveKeywords - negativeKeywords) / totalWords
// Concern flags triggered by pattern matching:
if (text.includes(['where am I', 'don't know where'])) → spatial_disorientation
if (text.includes(['what day', 'what year'])) → temporal_disorientation  
if (urgentKeywords.length > 0) → URGENT_INTERVENTION_NEEDED
```

### Privacy Architecture
- **Default mode**: All data in `localStorage` — zero network transmission
- **Opt-in cloud**: Firebase Firestore with security rules (patient data sandboxed by ID)
- **Export format**: Standard JSON (portability guaranteed)
- **No PII in Analytics**: `anonymize_ip: true`, no user identifiers sent

---

## ✨ Features

### 🎤 Voice-Friendly Patient Journal
- Speak naturally — **Web Speech API** transcribes in real time
- **No typing required** — designed for elderly, motor-impaired users
- Maya reads her responses aloud via **Speech Synthesis**
- Auto-saves every conversation with full analytics metadata

### 🧠 Maya — Empathetic AI Companion
- Powered by **Google Gemini AI** (`gemini-2.0-flash`)
- 6 specialized prompts ensure empathy-first responses
- **Conversation memory** — Maya references earlier parts of the session
- **Demo mode** — works with mock responses when API key is absent

### 📊 Family Caregiver Dashboard
- **Sentiment trend chart** — 7/14/30-day emotional wellbeing trends
- **Clarity gauge** — animated SVG radial gauge (0–100)
- **Keyword cloud** — visualize frequently recalled people, places, topics
- **Alert banners** — automatic flags for temporal/spatial disorientation
- **Session summaries** — AI-generated caregiver notes per journal entry

### 🧩 Cognitive Exercises (8 types)
| Exercise | Type | Difficulty |
|---|---|---|
| Word Association | Language recall | Easy |
| Story Continuation | Creative memory | Easy |
| Memory Lane | Autobiographical | Easy |
| Sensory Exploration | Multisensory recall | Medium |
| Music Memories | Emotional memory | Easy |
| Category Challenge | Semantic fluency | Medium |
| Gratitude Garden | Positive reinforcement | Easy |
| Life Timeline | Episodic memory | Hard |

### 🔒 Privacy & Security
- **HTTPS only** (Vercel enforced)
- **API keys** stored in environment variables, never in code
- **Input sanitization** on all user-provided text
- **localStorage** encryption-ready (sandboxed by origin)
- **Firebase Security Rules** (data sandboxed per patient ID)
- **Anonymized analytics** (`anonymize_ip: true`)

### ♿ Accessibility (WCAG AA)
- Voice input/output for motor-impaired users
- Extra-large text mode for vision-impaired users
- Full keyboard navigation with visible focus indicators
- ARIA roles, labels, and live regions throughout
- High-contrast color system (≥4.5:1 ratio)
- Responsive layout optimized for tablets (common in care facilities)
- Skip-to-content link for screen reader users

---

## 🔗 Google Services Integration

### 1. Google Gemini AI (`gemini-2.0-flash`)
**Primary intelligence engine** — powers all AI features:
- Patient conversation (Maya persona)
- Real-time sentiment analysis
- Cognitive clarity assessment (0-100)
- Memory keyword extraction
- Adaptive exercise generation
- Caregiver session summaries

### 2. Firebase Firestore
**Optional cloud backup** — enables family sharing:
- Journal entries synced per patient ID
- Security rules prevent cross-patient access
- Offline-first: Firestore persists locally when offline
- Graceful fallback to localStorage when not configured

### 3. Google Maps Places API
**Care facility discovery** — helps families find local resources:
- Searches for nearby memory care centers, dementia specialists
- Filters by type: `health`, keyword: `memory care dementia alzheimer`
- Returns name, address, rating, GPS coordinates

### 4. Google Analytics 4 (gtag.js)
**Privacy-respecting usage analytics**:
- Page view tracking (anonymized)
- Feature usage: journal sessions, exercises, voice input
- `anonymize_ip: true` — HIPAA-conscious design

### 5. Google Cloud Text-to-Speech
**Enhanced Maya voice** (when configured):
- Neural voice `en-US-Neural2-F` — warm, natural female voice
- Slower speaking rate (0.9x) for elderly users
- Falls back to browser Speech Synthesis if not configured

### 6. Google Fonts
**Accessible typography**:
- **Inter** — clean UI font for dashboard/nav
- **Merriweather** — warm serif for patient-facing reading

---

## 🧪 Testing

### Test Suite: 103 Tests, 8 Test Files

| Test File | Tests | Coverage Area |
|---|---|---|
| `storage.test.js` | 17 | CRUD operations, analytics, export/import, edge cases |
| `sentiment.test.js` | 17 | Positive/negative/mixed sentiment, concern detection, trends |
| `date-helpers.test.js` | 15 | Formatting, relative time, greeting, chronological ordering |
| `ai.test.js` | 13 | Prompt content validation, safety guardrails, Gemini config |
| `sample-data.test.js` | 10 | Data integrity, loading, detection, schema validation |
| `google-services.test.js` | 11 | Analytics tracking, Firebase config, Maps config |
| `components.test.jsx` | 18 | UI rendering, ARIA, accessibility, keyboard navigation |
| `speech.test.js` | 2 | Browser API detection, graceful degradation |

### Run Tests
```bash
npm test              # Run all 103 tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

### Edge Cases Covered
- Empty/null input handling
- Missing API key → graceful mock fallback
- Speech API unsupported → text-only fallback
- Firebase not configured → localStorage fallback
- Invalid JSON on import → error with user message
- Very long text input → stable performance
- Special characters → sanitized gracefully

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **Google Gemini API key** — free at [Google AI Studio](https://aistudio.google.com/apikey)

### Installation
```bash
git clone https://github.com/KL2300030695/CogniSync.git
cd CogniSync
npm install
cp .env.example .env
# Add your API key to .env
npm run dev
```

### Environment Variables
```env
# Required
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional — Google Analytics  
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional — Firebase cloud sync
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=yourapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=yourapp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Optional — Enhanced features
VITE_GOOGLE_MAPS_KEY=your_maps_api_key
VITE_GOOGLE_TTS_KEY=your_cloud_tts_key
```

---

## 📁 Project Structure

```
src/
├── ai/                          # AI Engine (Core Innovation)
│   ├── prompts.js               # 6 specialized system prompts for Maya
│   ├── gemini-client.js         # Gemini API wrapper with mock fallback
│   └── sentiment-analyzer.js   # Client-side fallback sentiment analysis
│
├── services/                    # Google Services Integration
│   └── google-services.js      # Analytics, Firebase, Maps, Cloud TTS
│
├── components/                  # Accessible UI Components
│   ├── Navbar.jsx               # Keyboard-navigable navigation
│   ├── VoiceInput.jsx           # Web Speech API with ARIA feedback
│   ├── ChatBubble.jsx           # Conversation bubbles with typing animation
│   ├── SentimentChart.jsx       # Chart.js trend visualization
│   ├── ClarityGauge.jsx         # Animated SVG radial gauge
│   ├── KeywordCloud.jsx         # Weighted keyword visualization
│   ├── CognitiveCard.jsx        # Accessible exercise selection card
│   ├── AlertBanner.jsx          # ARIA live region alerts
│   └── LoadingSpinner.jsx       # Accessible loading indicator
│
├── pages/                       # Application Routes
│   ├── LandingPage.jsx          # Marketing + feature showcase
│   ├── PatientJournal.jsx       # Voice journal + Maya AI chat
│   ├── FamilyDashboard.jsx      # Caregiver analytics dashboard
│   ├── CognitiveExercises.jsx   # 8 adaptive brain exercises
│   └── Settings.jsx             # Profile, preferences, data management
│
├── utils/                       # Utility Modules
│   ├── storage.js               # localStorage CRUD + Firebase sync hooks
│   ├── speech.js                # Web Speech API helpers
│   └── date-helpers.js         # Date formatting + analytics utilities
│
├── data/
│   └── sample-entries.js       # Realistic demo data for showcase
│
├── test/                        # Test Suite (103 tests)
│   ├── setup.js                 # Mock setup (localStorage, Speech APIs)
│   ├── storage.test.js          # Storage utility tests
│   ├── sentiment.test.js        # AI sentiment analysis tests
│   ├── date-helpers.test.js     # Date helper tests
│   ├── ai.test.js               # AI prompt validation tests
│   ├── google-services.test.js  # Google services integration tests
│   ├── sample-data.test.js      # Demo data integrity tests
│   ├── components.test.jsx      # UI component rendering tests
│   └── speech.test.js           # Speech API detection tests
│
├── App.jsx                      # Router + Google Analytics page tracking
├── main.jsx                     # Entry point + GA initialization
└── index.css                    # Design system (glassmorphism, themes)
```

---

## 🎨 Design Philosophy

### Dual-Mode Interface
| Mode | Users | Colors | Typography |
|---|---|---|---|
| **Patient Mode** | Elderly patients | Lavender, cream, sage | Merriweather serif, large |
| **Dashboard Mode** | Family caregivers | Navy dark, sky blue | Inter sans-serif, compact |

### Design Principles
1. **Calming Aesthetics** — No harsh colors, no sudden changes, no information overload for patients
2. **Accessibility First** — Voice input, large text option, high contrast, keyboard navigation
3. **Glassmorphism** — `backdrop-filter: blur(20px)` creates depth without visual noise
4. **Micro-animations** — Gentle transitions reinforce a sense of calm and reliability

---

## 📋 Assumptions Made

1. **Target patient profile**: Early-to-moderate stage cognitive impairment (can still converse)
2. **Primary browser**: Chrome or Edge (Web Speech API support); text-only fallback for others
3. **Privacy default**: All data stays on-device. Cloud sync is opt-in, not opt-out
4. **Medical scope**: CogniSync is a supportive companion, NOT a diagnostic or medical device
5. **Language**: English-only conversations in current version
6. **API rate limits**: Gemini free tier is sufficient for typical individual patient use (60 req/min)
7. **Care setting**: Home care or assisted living (not acute hospital) context
8. **Caregiver access**: Dashboard viewed by trusted family members, not clinical staff

---

## ⚠️ Disclaimer

CogniSync is **not a medical device** and does not provide medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>🧠 CogniSync</strong><br>
  Because every conversation matters.<br><br>
  Built with ❤️ and empathy · Powered by Google AI
</p>
