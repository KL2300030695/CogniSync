import React from 'react';

const COLORS = [
  { bg: '#F3E8FF', text: '#7B61C4' },
  { bg: '#FFF3E0', text: '#FF9800' },
  { bg: '#E8F5E9', text: '#4CAF50' },
  { bg: '#FCE4EC', text: '#EC407A' },
  { bg: '#E3F2FD', text: '#42A5F5' },
  { bg: '#FFF8E7', text: '#F57F17' },
  { bg: '#F1F8E9', text: '#7CB342' },
  { bg: '#EDE7F6', text: '#5E35B1' },
];

export default function KeywordCloud({ keywords = [] }) {
  if (keywords.length === 0) {
    return (
      <div className="keyword-cloud" style={{ color: 'var(--text-tertiary)', minHeight: '100px' }}>
        <p>No keywords yet. Journal entries will populate this cloud.</p>
      </div>
    );
  }

  const maxCount = Math.max(...keywords.map(k => k.count), 1);

  return (
    <div className="keyword-cloud" id="keyword-cloud">
      {keywords.map((kw, index) => {
        const ratio = kw.count / maxCount;
        let sizeClass = 'keyword-cloud__word--sm';
        if (ratio > 0.7) sizeClass = 'keyword-cloud__word--lg';
        else if (ratio > 0.4) sizeClass = 'keyword-cloud__word--md';

        const color = COLORS[index % COLORS.length];

        return (
          <span
            key={kw.word}
            className={`keyword-cloud__word ${sizeClass}`}
            style={{
              background: color.bg,
              color: color.text,
              borderColor: `${color.text}22`,
            }}
            title={`Mentioned ${kw.count} time${kw.count > 1 ? 's' : ''}`}
          >
            {kw.word}
          </span>
        );
      })}
    </div>
  );
}
