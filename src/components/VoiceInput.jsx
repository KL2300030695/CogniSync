/**
 * VoiceInput component — speech-to-text input for hands-free attendee queries.
 * Uses the Web Speech API with graceful fallback when unsupported.
 * @module components/VoiceInput
 */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { startListening, stopListening, isSpeechSupported } from '../utils/speech';

const IS_SPEECH_SUPPORTED = isSpeechSupported();

export default function VoiceInput({ onTranscript, onFinalTranscript, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState(null);

  const handleToggle = useCallback(() => {
    if (isRecording) {
      stopListening();
      setIsRecording(false);
      setInterimText('');
    } else {
      setError(null);
      const started = startListening(
        (result) => {
          setInterimText(result.interim);
          onTranscript?.(result.combined);
        },
        (err) => {
          setError(err);
          setIsRecording(false);
        },
        (finalText) => {
          setIsRecording(false);
          setInterimText('');
          if (finalText) {
            onFinalTranscript?.(finalText);
          }
        }
      );
      if (started) {
        setIsRecording(true);
      }
    }
  }, [isRecording, onTranscript, onFinalTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  if (!IS_SPEECH_SUPPORTED) {
    return (
      <button
        className="voice-btn"
        disabled
        title="Speech recognition not supported. Use Chrome."
        style={{ opacity: 0.4, cursor: 'not-allowed' }}
      >
        🎤
      </button>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`voice-btn ${isRecording ? 'voice-btn--active' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
        id="voice-input-btn"
        aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
      >
        {isRecording ? '⏹' : '🎤'}
      </button>
      
      {isRecording && interimText && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          right: 0,
          background: 'var(--bg-card)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          maxWidth: '250px',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeInUp 0.2s ease',
          fontStyle: 'italic',
        }}>
          🎙️ {interimText}...
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          right: 0,
          background: 'var(--danger-light)',
          border: '1px solid rgba(239,83,80,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          fontSize: '0.8rem',
          color: 'var(--danger)',
          maxWidth: '200px',
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

VoiceInput.propTypes = {
  onTranscript: PropTypes.func,
  onFinalTranscript: PropTypes.func,
  disabled: PropTypes.bool,
};
