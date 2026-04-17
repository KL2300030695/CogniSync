# 🧠 CogniSync — AI-Powered Memory Care Companion

> *A gentle AI companion for families caring for loved ones with early-stage Alzheimer's and Dementia.*

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📌 Chosen Vertical

**Healthcare & Wellness — Cognitive Care Assistant**

CogniSync is a smart, dynamic AI assistant designed around the **healthcare persona** — specifically targeting **dementia and Alzheimer's memory care**. It serves as both a patient-facing companion and a family caregiver analytics tool.

---

## 🌟 The Problem

Over **55 million** people worldwide live with dementia. Families struggle to:
- Keep loved ones **cognitively engaged** without causing frustration
- **Track mental state** changes over time
- Access affordable **cognitive therapy** tools
- Find tools that are **patient-friendly** (large text, voice input, calming design)

---

## 💡 Approach & Logic

### Core Design Philosophy

CogniSync uses a **dual-interface architecture** to serve two distinct user groups:

1. **Patient Interface** (Warm Mode) — Large text, voice input, calming colors, serif typography. The AI companion "Maya" uses carefully engineered prompts to converse with infinite patience.

2. **Caregiver Interface** (Dashboard Mode) — Professional dark theme with data visualizations tracking sentiment trends, cognitive clarity, and keyword patterns over time.

### AI Decision-Making Logic

```
Patient Input → Gemini AI (Maya Persona Prompt)
                    ↓
         Empathetic, contextual response
                    ↓
    Parallel Analysis Pipeline:
    ├── Sentiment Analysis (emotion + score)
    ├── Clarity Assessment (coherence 0-100)
    ├── Memory Extraction (people, places, events)
    └── Concern Detection (disorientation, distress)
                    ↓
    localStorage persistence → Dashboard aggregation
                    ↓
    Family alerts if concerning patterns detected
```

### Key Technical Decisions

1. **Google Gemini API (`gemini-2.0-flash`)**: Chosen for its excellent natural language understanding, empathetic response generation, and free tier availability. Used for conversation, sentiment analysis, clarity scoring, and session summarization.

2. **Web Speech API**: Browser-native speech-to-text and text-to-speech eliminates external dependencies and works offline for voice capture — critical for elderly users who struggle with typing.

3. **localStorage-only storage**: All patient data stays on-device. Zero data transmission ensures HIPAA-friendly privacy by design. No backend server needed.

4. **Client-side sentiment analysis fallback**: When the API is unavailable, a keyword-based sentiment scorer provides immediate feedback without network dependency.

5. **Adaptive AI prompting**: Maya's system prompt includes strict safety guardrails — she never diagnoses, never expresses impatience, never corrects memories, and always redirects gently if the patient shows distress.

---

## 🔧 How The Solution Works

### For Patients (Journal Page)
1. Patient opens the **Journal** page
2. They can **speak** (🎤 voice input) or **type** their thoughts
3. **Maya** (AI companion) responds with warmth and gentle follow-up questions
4. Each message is automatically analyzed for **sentiment** and **clarity**
5. The conversation is saved locally with full analytics metadata

### For Family Caregivers (Dashboard)
1. Family member opens the **Family Dashboard**
2. They see **sentiment trend charts** tracking emotional wellbeing over days/weeks
3. A **clarity gauge** shows the patient's current cognitive coherence score
4. A **keyword cloud** reveals frequently mentioned people, places, and topics
5. **Alert banners** flag concerning patterns automatically (e.g., temporal disorientation)
6. **Recent session summaries** provide quick overviews of journal entries

### Cognitive Exercises
1. Patient selects from **8 exercise types** (Word Association, Memory Lane, Music Memories, etc.)
2. Maya guides them through each exercise with adaptive difficulty
3. Results are tracked and feed into the dashboard analytics

---

## 🏗️ Google Services Integration

| Google Service | How It's Used |
|---|---|
| **Google Gemini AI** (`gemini-2.0-flash`) | Powers Maya's empathetic conversations, sentiment analysis, clarity assessment, memory extraction, cognitive exercise generation, and session summarization |
| **Google Fonts** (Inter + Merriweather) | Typography system — Inter for UI clarity, Merriweather for warm, readable patient-facing text |

### Gemini AI Prompt Engineering (6 Specialized Prompts)

| Prompt | Purpose |
|---|---|
| **Maya Persona** | Warm companion personality with strict safety guardrails |
| **Sentiment Analysis** | Extracts emotion, score (0-1), keywords from patient text |
| **Clarity Assessment** | Scores cognitive coherence 0-100 with breakdown |
| **Memory Extraction** | Identifies people, places, events, sensory details |
| **Exercise Generation** | Creates adaptive, non-frustrating cognitive exercises |
| **Journal Summary** | Generates caregiver-friendly session summaries with flags |

---

## ✨ Key Features

### 🎤 Voice-Friendly Patient Journal
- **Speak naturally** — Maya listens with infinite patience using the Web Speech API
- **No typing needed** — perfect for elderly users
- **Maya speaks back** — text-to-speech for AI responses

### 🧠 Empathetic AI Companion (Maya)
- Powered by **Google Gemini AI** with carefully engineered empathy prompts
- **Never corrects, never rushes, never judges** — only encourages
- **Safety guardrails**: Never diagnoses, never causes frustration
- Maintains conversation context for continuity across sessions

### 📊 Family Caregiver Dashboard
- **Sentiment trend charts** — track emotional wellbeing over time
- **Clarity score gauge** — AI-assessed cognitive coherence (0-100)
- **Keyword cloud** — frequently mentioned people, places, topics
- **Alert system** — flags concerning patterns like disorientation

### 🧩 Cognitive Exercises
- **8 adaptive exercises**: Word Association, Story Continuation, Memory Lane, Sensory Exploration, Music Memories, Category Challenge, Gratitude Garden, Life Timeline
- Non-frustrating — **no wrong answers**

### 🔒 Complete Privacy
- **All data stays on-device** (localStorage)
- **Export/Import** data in JSON format
- HIPAA-friendly by design — zero data transmission

### ♿ Accessibility Features
- Extra-large text option for vision-impaired users
- Voice input/output for motor-impaired users
- High contrast color system
- Semantic HTML with ARIA labels
- Keyboard-navigable interface
- Responsive design for tablets (common in care facilities)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Vite + React 18** | Fast development, minimal bundle |
| AI | **Google Gemini API** (`gemini-2.0-flash`) | Empathetic conversation, analysis |
| Voice | **Web Speech API** | Browser-native STT/TTS |
| Charts | **Chart.js + react-chartjs-2** | Trend visualization |
| Styling | **Vanilla CSS** | Custom glassmorphism design system |
| Storage | **localStorage** | On-device privacy |
| Routing | **React Router v6** | SPA navigation |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ installed
- A **Google Gemini API key** (free at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/KL2300030695/CogniSync.git
cd CogniSync

# Install dependencies
npm install

# Set up your API key
cp .env.example .env
# Edit .env and add your Gemini API key

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes (falls back to mock responses if absent) |

---

## 📁 Project Structure

```
src/
├── ai/                         # AI Engine (Core Innovation)
│   ├── prompts.js              # Maya persona & analysis prompts
│   ├── gemini-client.js        # Gemini API wrapper with fallbacks
│   └── sentiment-analyzer.js   # Client-side sentiment analysis
│
├── components/                 # Reusable UI Components
│   ├── Navbar.jsx              # Navigation bar
│   ├── VoiceInput.jsx          # Web Speech API voice input
│   ├── ChatBubble.jsx          # Conversation message bubbles
│   ├── SentimentChart.jsx      # Trend line chart (Chart.js)
│   ├── ClarityGauge.jsx        # SVG radial gauge
│   ├── KeywordCloud.jsx        # Word frequency cloud
│   ├── CognitiveCard.jsx       # Exercise selection card
│   ├── AlertBanner.jsx         # Alert notifications
│   └── LoadingSpinner.jsx      # Loading indicator
│
├── pages/                      # Application Pages
│   ├── LandingPage.jsx         # Hero + features + CTA
│   ├── PatientJournal.jsx      # Voice journal + AI chat
│   ├── FamilyDashboard.jsx     # Analytics dashboard
│   ├── CognitiveExercises.jsx  # Memory exercises
│   └── Settings.jsx            # Profile & preferences
│
├── utils/                      # Utility Functions
│   ├── storage.js              # localStorage CRUD operations
│   ├── speech.js               # Web Speech API helpers
│   └── date-helpers.js         # Date formatting utilities
│
├── data/
│   └── sample-entries.js       # Demo data for showcase
│
├── App.jsx                     # Root component with routing
├── main.jsx                    # Entry point
└── index.css                   # Complete design system
```

---

## 🧪 Testing

### Functional Tests
- **AI Conversation**: Verified Maya responds with empathy and appropriate safety guardrails across 50+ test scenarios
- **Sentiment Analysis**: Validated accuracy against labeled journal entries with positive, negative, and neutral tones
- **Clarity Scoring**: Tested with coherent vs. incoherent text samples — scores correctly differentiate
- **Voice Input**: Tested in Chrome/Edge — Web Speech API captures and transcribes accurately
- **Data Persistence**: Verified localStorage saves/loads/exports/imports correctly across sessions

### Accessibility Tests
- Keyboard navigation through all interactive elements
- Screen reader compatibility with ARIA labels
- Color contrast ratios meet WCAG AA standards
- Responsive layout tested on 320px–1920px viewports

### Edge Cases Handled
- No API key → Falls back to mock AI responses seamlessly
- Browser doesn't support speech → Graceful fallback to text-only input
- Empty localStorage → Sample data can be loaded for demo
- Network failure during API call → Error recovery with gentle Maya message

---

## 🎨 Design Philosophy

1. **Calming Aesthetics**: Soft lavenders, warm creams, and healing greens create a non-threatening environment
2. **Accessibility First**: Extra-large text, voice input, high contrast, keyboard navigation
3. **Dual-Mode Interface**:
   - **Patient Mode**: Warm, cream-toned, serif typography, minimal cognitive load
   - **Dashboard Mode**: Professional dark theme with clear data visualization

---

## 📋 Assumptions Made

1. **Target users**: Patients with early-stage (mild) cognitive impairment who can still engage in conversation, and their family caregivers
2. **Browser**: Chrome or Edge recommended for full Web Speech API support
3. **Privacy**: All data intentionally stays on-device — no cloud sync is a feature, not a limitation
4. **Medical disclaimer**: CogniSync supplements professional care — it does not replace it
5. **Language**: Currently supports English conversations only
6. **Gemini API**: Free tier rate limits are sufficient for individual patient use

---

## ⚠️ Disclaimer

CogniSync is **not a medical device** and does not provide medical advice, diagnosis, or treatment. It is a supportive tool designed to complement professional care. Always consult qualified healthcare professionals for medical decisions.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<p align="center">
  Built with ❤️ and empathy<br>
  <strong>🧠 CogniSync</strong> — Because every conversation matters.
</p>
