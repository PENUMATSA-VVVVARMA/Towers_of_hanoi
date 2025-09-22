import React, { useState } from 'react';
import ApiService from '../utils/apiService';
import './ScoreSubmission.css';

const ScoreSubmission = ({ gameResult, onClose, onSubmitted }) => {
  const [playerName, setPlayerName] = useState(
    localStorage.getItem('playerName') || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (playerName.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const scoreData = {
        playerName: playerName.trim(),
        level: gameResult.level,
        moves: gameResult.moves,
        timeInSeconds: gameResult.timeInSeconds,
      };

      await ApiService.submitScore(scoreData);
      
      // Save name for future use
      localStorage.setItem('playerName', playerName.trim());
      
      setSuccess(true);
      setTimeout(() => {
        onSubmitted && onSubmitted();
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLevelName = (level) => {
    const names = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
    return names[level] || 'Unknown';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="score-submission-overlay">
        <div className="score-submission-modal success-modal">
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <h2>Score Submitted!</h2>
            <p>Your score has been added to the leaderboard.</p>
            <div className="success-animation"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="score-submission-overlay">
      <div className="score-submission-modal">
        <div className="modal-header">
          <h2>🏆 Submit Your Score</h2>
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="game-summary">
          <h3>Game Complete!</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="label">Level:</span>
              <span className="value level-badge">
                {getLevelName(gameResult.level)}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Score:</span>
              <span className="value score-value">
                {gameResult.score.toLocaleString()}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Moves:</span>
              <span className="value">
                {gameResult.moves}
                {gameResult.isOptimal && <span className="optimal-badge">⚡ Optimal!</span>}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Time:</span>
              <span className="value">{formatTime(gameResult.timeInSeconds)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="score-form">
          <div className="form-group">
            <label htmlFor="playerName">Your Name:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength="50"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Skip
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting || !playerName.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Submitting...
                </>
              ) : (
                'Submit Score'
              )}
            </button>
          </div>
        </form>

        <div className="submission-note">
          <p>🌟 Submit your score to compete with players worldwide!</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreSubmission;