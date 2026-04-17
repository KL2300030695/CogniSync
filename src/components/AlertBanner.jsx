/**
 * AlertBanner component for displaying dismissible notifications.
 * Supports info, warning, danger, and success alert types.
 * @module components/AlertBanner
 */
import React from 'react';
import PropTypes from 'prop-types';

/** @type {Object.<string, string>} Maps alert type to its emoji icon */
const ALERT_ICONS = {
  warning: '⚠️',
  danger: '🚨',
  info: 'ℹ️',
  success: '✅',
};

/**
 * @param {Object} props
 * @param {'info'|'warning'|'danger'|'success'} [props.type='info'] - Alert type
 * @param {string} [props.title] - Optional bold title
 * @param {string} props.message - Alert message text
 * @param {Function} [props.onDismiss] - Callback to dismiss the alert
 */
export default function AlertBanner({ type = 'info', title, message, onDismiss }) {
  return (
    <div className={`alert-banner alert-banner--${type}`} role="alert" id={`alert-${type}`}>
      <span className="alert-banner__icon">{ALERT_ICONS[type]}</span>
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

AlertBanner.propTypes = {
  type: PropTypes.oneOf(['info', 'warning', 'danger', 'success']),
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
};
