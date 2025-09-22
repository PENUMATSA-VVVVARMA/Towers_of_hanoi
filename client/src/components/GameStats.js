import React from 'react';
import './GameStats.css';

const GameStats = ({ moves, time, minMoves, level }) => {
  const efficiency = moves > 0 ? Math.round((minMoves / moves) * 100) : 100;
  const isOptimal = moves === minMoves;
  
  return (
    <div className="game-stats">
      <div className="stat-item">
        <div className="stat-label">Time</div>
        <div className="stat-value">{time}</div>
      </div>
      
      <div className="stat-item">
        <div className="stat-label">Moves</div>
        <div className={`stat-value ${isOptimal ? 'optimal' : ''}`}>
          {moves}
          {moves > 0 && <span className="min-moves">/{minMoves}</span>}
        </div>
      </div>
      
      <div className="stat-item">
        <div className="stat-label">Level</div>
        <div className="stat-value level-badge">
          {level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard'}
        </div>
      </div>
      
      {moves > 0 && (
        <div className="stat-item">
          <div className="stat-label">Efficiency</div>
          <div className={`stat-value efficiency ${
            efficiency === 100 ? 'perfect' : efficiency >= 80 ? 'good' : 'needs-improvement'
          }`}>
            {efficiency}%
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;