import React from 'react';

export default function CognitiveCard({ exercise, onClick, index = 0 }) {
  return (
    <div
      className="exercise-card"
      onClick={() => onClick?.(exercise)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(exercise)}
      id={`exercise-card-${index}`}
      style={{ animationDelay: `${index * 0.1}s`, animation: 'fadeInUp 0.4s ease both' }}
    >
      <div className="exercise-card__emoji">{exercise.emoji}</div>
      <h3 className="exercise-card__title">{exercise.title}</h3>
      <p className="exercise-card__desc">{exercise.description}</p>
      <span className={`exercise-card__difficulty exercise-card__difficulty--${exercise.difficulty}`}>
        {exercise.difficulty === 'easy' ? '🟢' : exercise.difficulty === 'medium' ? '🟡' : '🔴'}
        {' '}{exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
      </span>
    </div>
  );
}
