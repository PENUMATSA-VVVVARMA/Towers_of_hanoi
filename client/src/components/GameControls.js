import React from 'react';
import './GameControls.css';

const GameControls = ({ 
  onRestart, 
  onHint, 
  onBackToMenu, 
  isGameComplete, 
  canGetHint 
}) => {
  return (
    <div className="game-controls">
      <button 
        className="control-button secondary"
        onClick={onBackToMenu}
      >
        🏠 Main Menu
      </button>
      
      <button 
        className="control-button warning"
        onClick={onRestart}
      >
        🔄 Restart
      </button>
      
      <button 
        className="control-button info"
        onClick={onHint}
        disabled={!canGetHint}
      >
        💡 Hint
      </button>
      
      {isGameComplete && (
        <button 
          className="control-button success celebration"
          onClick={onBackToMenu}
        >
          🎉 Play Again
        </button>
      )}
    </div>
  );
};

export default GameControls;