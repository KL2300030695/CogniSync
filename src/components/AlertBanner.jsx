import React from 'react';

export default function AlertBanner({ type = 'info', title, message, onDismiss }) {
  const icons = {
    warning: '⚠️',
    danger: '🚨',
    info: 'ℹ️',
    success: '✅',
  };

  return (
    <div className={`alert-banner alert-banner--${type}`} role="alert" id={`alert-${type}`}>
      <span className="alert-banner__icon">{icons[type]}</span>
      <div className="alert-banner__content">
        {title && <div className="alert-banner__title">{title}</div>}
        <div className="alert-banner__text">{message}</div>
      </div>
      {onDismiss && (
        <button
          className="btn-ghost"
          onClick={onDismiss}
          style={{ flexShrink: 0, padding: '4px 8px', fontSize: '1.1rem' }}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
