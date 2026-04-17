/**
 * LoadingSpinner component with configurable size and text.
 * Used throughout the app for async loading states.
 * @module components/LoadingSpinner
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Spinner size variant
 * @param {string} [props.text=''] - Optional loading message
 */
export default function LoadingSpinner({ size = 'md', text = '' }) {
  return (
    <div className={`spinner spinner--${size}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div className="spinner__circle"></div>
      {text && <span className="text-sm text-muted">{text}</span>}
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string,
};
