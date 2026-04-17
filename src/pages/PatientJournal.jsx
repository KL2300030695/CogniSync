import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatBubble, { TypingIndicator } from '../components/ChatBubble';
import VoiceInput from '../components/VoiceInput';
import { sendMessageToMaya, analyzeSentiment, resetChatSession, isApiConfigured } from '../ai/gemini-client';
import { analyzeLocalSentiment } from '../ai/sentiment-analyzer';
import { saveJournalEntry, getPatientProfile, getEntriesToday } from '../utils/storage';
import { speak, stopSpeaking } from '../utils/speech';
import { getGreeting } from '../utils/date-helpers';
import AlertBanner from '../components/AlertBanner';

const INITIAL_MESSAGE = {
  role: 'maya',
  text: '',
  timestamp: new Date().toISOString(),
};

export default function PatientJournal() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(!isApiConfigured());
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const profile = getPatientProfile();
  const patientName = profile.preferredName || profile.name || 'friend';

  // Initialize with greeting
  useEffect(() => {
    resetChatSession();
    const greeting = getGreeting();
    const todayEntries = getEntriesToday();
    let greetingText;

    if (todayEntries.length > 0) {
      greetingText = `Welcome back! I'm so glad to talk with you again today 🌸 What would you like to share?`;
    } else if (patientName && patientName !== 'friend') {
      greetingText = `${greeting}, ${patientName}! I'm Maya, and I'm so happy to be here with you today 🌸 Take your time — there's absolutely no rush. How has your day been?`;
    } else {
      greetingText = `${greeting}! I'm Maya, your friendly companion 🌸 I'm here to listen and chat with you. There's no rush at all — take your time. How are you feeling today?`;
    }

    setMessages([{
      ...INITIAL_MESSAGE,
      text: greetingText,
    }]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  // Send message
  const handleSend = useCallback(async (text = inputText) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Add patient message
    const patientMessage = {
      role: 'patient',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, patientMessage]);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Show typing indicator
    setIsLoading(true);

    try {
      // Get Maya's response
      const response = await sendMessageToMaya(trimmed, patientName);
      
      const mayaMessage = {
        role: 'maya',
        text: response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, mayaMessage]);

      // Analyze sentiment in background
      let sentiment;
      try {
        sentiment = await analyzeSentiment(trimmed);
      } catch {
        sentiment = analyzeLocalSentiment(trimmed);
      }

      // Save journal entry
      saveJournalEntry({
        messages: [patientMessage, mayaMessage],
        sentiment,
        patientText: trimmed,
        mayaResponse: response,
      });

    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        role: 'maya',
        text: "I'm here with you. Could you say that again? I want to make sure I hear you properly 🌸",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, patientName]);

  // Handle keyboard submit
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle voice transcript
  const handleVoiceTranscript = (text) => {
    setInputText(text);
  };

  const handleVoiceFinal = (text) => {
    if (text) {
      setInputText(text);
      // Auto-send after a brief pause
      setTimeout(() => handleSend(text), 500);
    }
  };

  // Maya speaks aloud
  const handleMayaSpeak = async (text) => {
    try {
      setIsSpeaking(true);
      await speak(text);
    } catch (e) {
      // Speech synthesis not available
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="journal page-enter">
      {/* Header */}
      <div className="journal__header">
        <div className="journal__maya-avatar">🧠</div>
        <h1 className="heading-md">Chat with Maya</h1>
        <p className="text-muted">Your caring AI companion — always patient, always kind</p>
      </div>

      {showApiWarning && (
        <AlertBanner
          type="info"
          title="Demo Mode"
          message="Using simulated AI responses. Add your Gemini API key in Settings for real AI conversations."
          onDismiss={() => setShowApiWarning(false)}
        />
      )}

      {/* Messages */}
      <div className="journal__messages" id="journal-messages">
        {messages.map((msg, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <ChatBubble message={msg} />
            {msg.role === 'maya' && (
              <button
                className="btn-ghost"
                onClick={() => handleMayaSpeak(msg.text)}
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: msg.role === 'maya' ? '8px' : 'auto',
                  right: msg.role === 'patient' ? '8px' : 'auto',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  opacity: 0.6,
                }}
                title="Listen to Maya"
                aria-label="Listen to Maya speak this message"
              >
                {isSpeaking ? '⏹' : '🔊'}
              </button>
            )}
          </div>
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="journal__input-area">
        <div className="journal__input-wrapper" id="journal-input-area">
          <textarea
            ref={textareaRef}
            className="journal__textarea"
            placeholder="Type or use the microphone to speak..."
            value={inputText}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={1}
            id="journal-textarea"
            aria-label="Type your message to Maya"
          />
          <button
            className="btn btn-primary btn-icon"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            id="journal-send-btn"
            aria-label="Send message"
            style={{ flexShrink: 0 }}
          >
            ➤
          </button>
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            onFinalTranscript={handleVoiceFinal}
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-muted text-center" style={{ marginTop: 'var(--space-sm)' }}>
          🔒 All conversations stay on your device — completely private
        </p>
      </div>
    </div>
  );
}
