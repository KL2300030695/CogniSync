import React from 'react';
import { formatTime } from '../utils/date-helpers';

export default function ChatBubble({ message, showSender = true }) {
  const { role, text, timestamp } = message;
  const isPatient = role === 'patient';

  return (
    <div className={`chat-bubble ${isPatient ? 'chat-bubble--patient' : 'chat-bubble--maya'}`}>
      {showSender && (
        <div className="chat-bubble__sender">
          {isPatient ? '👤 You' : '🧠 Maya'}
        </div>
      )}
      <div>{text}</div>
      {timestamp && (
        <div className="chat-bubble__time">{formatTime(timestamp)}</div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="chat-bubble chat-bubble--maya chat-bubble--typing">
      <div className="chat-bubble__sender" style={{ width: '100%', marginBottom: '4px' }}>
        🧠 Maya
      </div>
      <div style={{ display: 'flex', gap: '4px', paddingTop: '4px' }}>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}
