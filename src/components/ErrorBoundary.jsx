/**
 * ErrorBoundary component — catches runtime errors in child components.
 * Prevents the entire app from crashing and displays a recovery UI.
 * @module components/ErrorBoundary
 */
import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            padding: '2rem',
            margin: '2rem auto',
            maxWidth: '600px',
            background: 'var(--clr-card, #1a1a2e)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--txt-secondary, #aaa)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 24px',
              background: 'var(--clr-primary, #6366f1)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
