import React, { useState, useCallback } from 'react';
import CognitiveCard from '../components/CognitiveCard';
import ChatBubble, { TypingIndicator } from '../components/ChatBubble';
import { sendMessageToMaya } from '../ai/gemini-client';
import { saveExerciseResult } from '../utils/storage';

const EXERCISES = [
  {
    id: 'word_assoc',
    emoji: '💬',
    title: 'Word Association',
    description: 'Maya says a word, and you share the first thing that comes to mind. No wrong answers — just let your thoughts flow naturally!',
    difficulty: 'easy',
    prompt: 'Let\'s play a gentle word association game. I\'ll say a word, and you tell me the first thing that comes to your mind. There are no wrong answers! Let\'s start with a warm word: "Sunshine." What comes to your mind?',
  },
  {
    id: 'story_continue',
    emoji: '📖',
    title: 'Story Continuation',
    description: 'Maya starts a short story, and you continue it however you like. Be creative, be funny, be you!',
    difficulty: 'easy',
    prompt: 'Let\'s create a story together! I\'ll start, and you continue however you\'d like. Here we go: "Once upon a time, on a warm summer morning, a little bird landed on the windowsill and started singing a beautiful song..." What happens next?',
  },
  {
    id: 'memory_recall',
    emoji: '🏠',
    title: 'Memory Lane',
    description: 'Maya asks gentle questions about your favorite memories. Share as much or as little as you\'d like.',
    difficulty: 'easy',
    prompt: 'Let\'s take a gentle walk down memory lane 🌸 Think about your childhood home for a moment. Can you tell me one thing you remember about it? Maybe the color of the front door, or a room you loved? Take your time.',
  },
  {
    id: 'sensory',
    emoji: '🌺',
    title: 'Sensory Exploration',
    description: 'Close your eyes and describe a favorite place using all your senses. What do you see, hear, smell, taste, and feel?',
    difficulty: 'medium',
    prompt: 'Let\'s do something fun — a sensory exploration! Think of your favorite place in the whole world. Now, tell me: what do you SEE there? Describe it to me as if I\'ve never been. What colors stand out? 🌈',
  },
  {
    id: 'music_memory',
    emoji: '🎵',
    title: 'Music Memories',
    description: 'Tell Maya about songs or music that are special to you. Music and memory are deeply connected!',
    difficulty: 'easy',
    prompt: 'Music has a magical way of bringing back memories! 🎵 Can you think of a song that makes you feel happy? It could be from any time in your life. What song comes to mind, and what does it remind you of?',
  },
  {
    id: 'categories',
    emoji: '🧩',
    title: 'Category Challenge',
    description: 'Maya names a category, and you list as many items as you can think of. Take your time!',
    difficulty: 'medium',
    prompt: 'Let\'s play a fun category game! I\'ll name a category, and you tell me as many things in that category as you can think of. Take your time, there\'s no rush at all. Ready? The category is: "Things you might find in a kitchen." What comes to mind? 🍳',
  },
  {
    id: 'gratitude',
    emoji: '💛',
    title: 'Gratitude Garden',
    description: 'Share three things you\'re grateful for today. Big or small — everything counts!',
    difficulty: 'easy',
    prompt: 'Let\'s plant a little gratitude garden today 🌱 Can you think of one thing — big or small — that made you smile recently or that you\'re thankful for? It could be anything: a warm cup of tea, a sunny day, someone\'s kind words...',
  },
  {
    id: 'timeline',
    emoji: '📅',
    title: 'Life Timeline',
    description: 'Let\'s explore the chapters of your life. Share milestones and special moments from any era.',
    difficulty: 'hard',
    prompt: 'Let\'s explore the chapters of your life story! 📖 Think about a really important moment — maybe when you were young. It could be a birthday, a celebration, meeting someone special, or achieving something you were proud of. What moment comes to mind?',
  },
];

export default function CognitiveExercises() {
  const [activeExercise, setActiveExercise] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartExercise = useCallback(async (exercise) => {
    setActiveExercise(exercise);
    setMessages([]);
    setIsLoading(true);

    const mayaMessage = {
      role: 'maya',
      text: exercise.prompt,
      timestamp: new Date().toISOString(),
    };
    setMessages([mayaMessage]);
    setIsLoading(false);
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    const patientMessage = { role: 'patient', text: trimmed, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, patientMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const contextPrompt = `[Cognitive Exercise: ${activeExercise.title}] The patient responded: "${trimmed}". Continue the exercise naturally, praise their effort, and ask a gentle follow-up to continue engaging them. Stay warm and patient.`;
      const response = await sendMessageToMaya(contextPrompt);
      
      setMessages(prev => [...prev, {
        role: 'maya',
        text: response,
        timestamp: new Date().toISOString(),
      }]);

      // Save exercise result
      saveExerciseResult({
        exerciseId: activeExercise.id,
        exerciseTitle: activeExercise.title,
        response: trimmed,
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'maya',
        text: "That's wonderful! I love hearing your thoughts. Would you like to share anything else? 🌸",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, activeExercise]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    setActiveExercise(null);
    setMessages([]);
  };

  // Exercise session view
  if (activeExercise) {
    return (
      <div className="journal page-enter" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ padding: 'var(--space-lg)' }}>
          <button className="btn btn-ghost" onClick={handleBack} id="exercise-back-btn" style={{ marginBottom: 'var(--space-md)' }}>
            ← Back to exercises
          </button>
          
          <div className="text-center" style={{ marginBottom: 'var(--space-xl)' }}>
            <span style={{ fontSize: '3rem' }}>{activeExercise.emoji}</span>
            <h2 className="heading-md" style={{ marginTop: 'var(--space-sm)' }}>{activeExercise.title}</h2>
            <p className="text-muted">{activeExercise.description}</p>
          </div>
        </div>

        <div className="journal__messages" style={{ minHeight: '300px', padding: '0 var(--space-lg)' }}>
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>

        <div className="journal__input-area" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
          <div className="journal__input-wrapper">
            <textarea
              className="journal__textarea"
              placeholder="Share your thoughts..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              id="exercise-textarea"
            />
            <button
              className="btn btn-primary btn-icon"
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              id="exercise-send-btn"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exercise grid view
  return (
    <div className="page-enter" style={{ padding: 'var(--space-xl) 0' }}>
      <div className="container">
        <div className="section__header">
          <h1 className="heading-lg">Cognitive <span className="text-gradient">Exercises</span></h1>
          <p className="section__subtitle">
            Gentle, enjoyable activities to engage your mind. No pressure, no wrong answers — just fun! 🧩
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {EXERCISES.map((exercise, index) => (
            <CognitiveCard
              key={exercise.id}
              exercise={exercise}
              onClick={handleStartExercise}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
