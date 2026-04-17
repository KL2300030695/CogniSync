/**
 * ChatBubble component for attendee/AI conversation display.
 * Renders individual messages with sender identification and timestamps.
 * @module components/ChatBubble
 */
import React from 'react';
import PropTypes from 'prop-types';
import { formatTime } from '../utils/date-helpers';

/**
 * Renders a single chat message bubble.
 * @param {Object} props
 * @param {Object} props.message - Message object with role, text, and timestamp
 * @param {boolean} [props.showSender=true] - Whether to display the sender label
 */
export default function ChatBubble({ message, showSender = true }) {
  const { role, text, timestamp } = message;
  const isAttendee = role === 'user' || role === 'attendee';

  return (
    <div className={`chat-bubble ${isAttendee ? 'chat-bubble--patient' : 'chat-bubble--maya'}`}>
      {showSender && (
        <div className="chat-bubble__sender">
          {isAttendee ? '👤 You' : '🧠 EventFlow AI'}
        </div>
      )}
      <div>{text}</div>
      {timestamp && (
        <div className="chat-bubble__time">{formatTime(timestamp)}</div>
      )}
    </div>
  );
}

ChatBubble.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
  }).isRequired,
  showSender: PropTypes.bool,
};

/**
 * Animated typing indicator shown while AI is processing a response.
 */
export function TypingIndicator() {
  return (
    <div className="chat-bubble chat-bubble--maya chat-bubble--typing">
      <div className="chat-bubble__sender" style={{ width: '100%', marginBottom: '4px' }}>
        🧠 EventFlow AI
      </div>
      <div style={{ display: 'flex', gap: '4px', paddingTop: '4px' }}>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}
