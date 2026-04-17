import React from 'react';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  return (
    <div className={`spinner spinner--${size}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div className="spinner__circle"></div>
      {text && <span className="text-sm text-muted">{text}</span>}
    </div>
  );
}
