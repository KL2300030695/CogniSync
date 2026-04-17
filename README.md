# 🧠 CogniSync — AI-Powered Memory Care Companion

> *A gentle AI companion for families caring for loved ones with early-stage Alzheimer's and Dementia.*

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 🌟 The Problem

Over **55 million** people worldwide live with dementia. Families struggle to:
- Keep loved ones **cognitively engaged** without causing frustration
- **Track mental state** changes over time
- Access affordable **cognitive therapy** tools
- Find tools that are **patient-friendly** (large text, voice input, calming design)

## 💡 The Solution

**CogniSync** bridges this gap with an AI-powered companion named **Maya** — a warm, infinitely patient conversational AI that:

1. **Journals with the patient** through natural voice or text conversations
2. **Gently stimulates memory recall** without pressure or frustration
3. **Tracks cognitive health** with sentiment analysis and clarity scoring
4. **Alerts families** to concerning patterns through an analytics dashboard

---

## ✨ Key Features

### 🎤 Voice-Friendly Patient Journal
- **Speak naturally** — Maya listens with infinite patience using the Web Speech API
- **No typing needed** — perfect for elderly users
- Conversations are warm, sensory-rich, and never rushing

### 🧠 Empathetic AI Companion (Maya)
- Powered by **Google Gemini AI** with carefully engineered empathy prompts
- **Never corrects, never rushes, never judges** — only encourages
- **Safety guardrails**: Never diagnoses, never causes frustration
- Maintains conversation context for continuity across sessions

### 📊 Family Caregiver Dashboard
- **Sentiment trend charts** — track emotional wellbeing over days/weeks
- **Clarity score gauge** — AI-assessed cognitive coherence (0-100)
- **Keyword cloud** — frequently mentioned people, places, topics
- **Alert system** — flags concerning patterns like disorientation
- **Session summaries** — AI-generated overviews for each journal entry

### 🧩 Cognitive Exercises
- **8 adaptive exercises**: Word Association, Story Continuation, Memory Lane, Sensory Exploration, Music Memories, Category Challenge, Gratitude Garden, Life Timeline
- Non-frustrating — **no wrong answers**
- Difficulty adapts to patient comfort level

### 🔒 Complete Privacy
- **All data stays on-device** (localStorage) — no cloud, no tracking
- **Export/Import** data in JSON format for portability
- HIPAA-friendly by design — zero data transmission

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **Vite + React 18** | Fast development, minimal bundle |
| AI | **Google Gemini API** (`gemini-2.0-flash`) | Empathetic conversation, sentiment analysis |
| Voice | **Web Speech API** | Browser-native STT/TTS — zero dependencies |
| Charts | **Chart.js + react-chartjs-2** | Sentiment & clarity trend visualization |
| Styling | **Vanilla CSS** | Custom glassmorphism design system |
| Storage | **localStorage** | On-device privacy, no backend needed |
| Routing | **React Router v6** | SPA navigation |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ installed
- A **Google Gemini API key** (free at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/CogniSync.git
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
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes (falls back to mock responses) |

---

## 📁 Project Structure

```
src/
├── ai/                     # AI Engine (Core Innovation)
│   ├── prompts.js          # Maya's persona & analysis prompts
│   ├── gemini-client.js    # Gemini API wrapper with fallbacks
│   └── sentiment-analyzer.js # Client-side sentiment analysis
│
├── components/             # Reusable UI Components
│   ├── Navbar.jsx          # Navigation bar
│   ├── VoiceInput.jsx      # Web Speech API voice input
│   ├── ChatBubble.jsx      # Conversation message bubbles
│   ├── SentimentChart.jsx  # Trend line chart (Chart.js)
│   ├── ClarityGauge.jsx    # SVG radial gauge
│   ├── KeywordCloud.jsx    # Word frequency cloud
│   ├── CognitiveCard.jsx   # Exercise selection card
│   ├── AlertBanner.jsx     # Alert notifications
│   └── LoadingSpinner.jsx  # Loading indicator
│
├── pages/                  # Application Pages
│   ├── LandingPage.jsx     # Hero + features + CTA
│   ├── PatientJournal.jsx  # Voice journal + AI chat
│   ├── FamilyDashboard.jsx # Analytics dashboard
│   ├── CognitiveExercises.jsx # Memory exercises
│   └── Settings.jsx        # Profile & preferences
│
├── utils/                  # Utility Functions
│   ├── storage.js          # localStorage CRUD operations
│   ├── speech.js           # Web Speech API helpers
│   └── date-helpers.js     # Date formatting utilities
│
├── data/
│   └── sample-entries.js   # Demo data for showcase
│
├── App.jsx                 # Root component with routing
├── main.jsx                # Entry point
└── index.css               # Complete design system
```

---

## 🎨 Design Philosophy

CogniSync's design is built on three principles:

1. **Calming Aesthetics**: Soft lavenders, warm creams, and healing greens create a non-threatening environment for patients
2. **Accessibility First**: Extra-large text option, voice input, high contrast, clear buttons
3. **Dual-Mode Interface**: 
   - **Patient Mode**: Warm, cream-toned, serif typography, minimal complexity
   - **Dashboard Mode**: Professional dark theme with clear data visualization

---

## 🤖 AI Prompt Engineering

The core innovation lies in Maya's prompt engineering:

- **Persona Design**: Maya is configured as a warm, patient companion who never rushes, never corrects memories, and uses sensory language to evoke recall
- **Safety Guardrails**: System prompts enforce that Maya never diagnoses, assesses cognitive decline, or uses frustrating language
- **Multi-Modal Analysis**: Separate specialized prompts for sentiment analysis, clarity assessment, memory extraction, and session summarization
- **Adaptive Responses**: Maya adjusts her communication style based on the patient's emotional state and response patterns

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
