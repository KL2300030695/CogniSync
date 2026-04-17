/**
 * ClarityGauge component — animated circular SVG gauge for occupancy scores.
 * Color-coded from red (low) to green (high) with animated fill.
 * @module components/ClarityGauge
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {number} [props.score=0] - Score value 0-100
 * @param {number} [props.size=180] - SVG gauge size in pixels
 */
export default function ClarityGauge({ score = 0, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  // Color based on score
  let color = '#EF5350'; // Red
  if (score >= 70) color = '#4CAF50'; // Green
  else if (score >= 50) color = '#FF9800'; // Orange
  else if (score >= 30) color = '#FFA726'; // Light orange

  let label = 'Low';
  if (score >= 80) label = 'Excellent';
  else if (score >= 65) label = 'Good';
  else if (score >= 45) label = 'Moderate';
  else if (score >= 25) label = 'Fair';

  return (
    <div className="clarity-gauge">
      <svg className="clarity-gauge__svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="clarity-gauge__bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="clarity-gauge__fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="clarity-gauge__label">
        <div className="clarity-gauge__score" style={{ color }}>
          {animatedScore}
        </div>
        <div className="clarity-gauge__text">{label}</div>
      </div>
    </div>
  );
}

ClarityGauge.propTypes = {
  score: PropTypes.number,
  size: PropTypes.number,
};
