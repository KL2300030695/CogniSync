import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import Navbar from '../components/Navbar';
import AlertBanner from '../components/AlertBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import ClarityGauge from '../components/ClarityGauge';
import KeywordCloud from '../components/KeywordCloud';
import CognitiveCard from '../components/CognitiveCard';

describe('Component Rendering', () => {
  describe('Navbar', () => {
    it('should render logo', () => {
      render(<MemoryRouter><Navbar /></MemoryRouter>);
      expect(screen.getByText(/EventFlow/i)).toBeInTheDocument();
    });

    it('should render navigation links', () => {
      render(<MemoryRouter><Navbar /></MemoryRouter>);
      expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
      expect(screen.getByText(/Staff Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Queue Monitor/i)).toBeInTheDocument();
    });

    it('should have accessible navigation landmark', () => {
      render(<MemoryRouter><Navbar /></MemoryRouter>);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('AlertBanner', () => {
    it('should render warning alert', () => {
      render(<AlertBanner type="warning" message="Test warning" />);
      expect(screen.getByText('Test warning')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<AlertBanner type="info" title="Alert Title" message="Alert message" />);
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Alert message')).toBeInTheDocument();
    });

    it('should render dismiss button when onDismiss provided', () => {
      const onDismiss = () => {};
      render(<AlertBanner type="success" message="Dismissible" onDismiss={onDismiss} />);
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });
  });

  describe('LoadingSpinner', () => {
    it('should render spinner', () => {
      const { container } = render(<LoadingSpinner />);
      expect(container.querySelector('.spinner')).toBeInTheDocument();
    });

    it('should render with text', () => {
      render(<LoadingSpinner text="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('ClarityGauge', () => {
    it('should render with score', () => {
      render(<ClarityGauge score={75} />);
      expect(screen.getByText('Good')).toBeInTheDocument();
    });

    it('should show correct label for low score', () => {
      render(<ClarityGauge score={20} />);
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('should show correct label for excellent score', () => {
      render(<ClarityGauge score={85} />);
      expect(screen.getByText('Excellent')).toBeInTheDocument();
    });

    it('should render SVG gauge', () => {
      const { container } = render(<ClarityGauge score={50} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('KeywordCloud', () => {
    it('should render empty state when no keywords', () => {
      render(<KeywordCloud keywords={[]} />);
      expect(screen.getByText(/No keywords yet/)).toBeInTheDocument();
    });

    it('should render keywords', () => {
      const keywords = [
        { word: 'garden', count: 5 },
        { word: 'Margaret', count: 3 },
        { word: 'birds', count: 2 },
      ];
      render(<KeywordCloud keywords={keywords} />);
      expect(screen.getByText('garden')).toBeInTheDocument();
      expect(screen.getByText('Margaret')).toBeInTheDocument();
      expect(screen.getByText('birds')).toBeInTheDocument();
    });
  });

  describe('CognitiveCard', () => {
    const exercise = {
      emoji: '💬',
      title: 'Word Association',
      description: 'Say the first thing that comes to mind.',
      difficulty: 'easy',
    };

    it('should render exercise details', () => {
      render(<CognitiveCard exercise={exercise} onClick={() => {}} />);
      expect(screen.getByText('Word Association')).toBeInTheDocument();
      expect(screen.getByText('Say the first thing that comes to mind.')).toBeInTheDocument();
    });

    it('should show difficulty badge', () => {
      render(<CognitiveCard exercise={exercise} onClick={() => {}} />);
      expect(screen.getByText(/Easy/)).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<CognitiveCard exercise={exercise} onClick={() => {}} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('App', () => {
    it('should render without crashing', () => {
      // App includes its own BrowserRouter, so render directly
      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });
  });
});
