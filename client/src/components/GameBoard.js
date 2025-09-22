import React, { useState, useEffect } from 'react';
import Tower from './Tower';
import GameControls from './GameControls';
import GameStats from './GameStats';
import { 
  initializeGame, 
  makeMove, 
  isValidMove, 
  calculateScore,
  getGameTime,
  formatTime,
  getHint
} from '../utils/gameLogic';
import './GameBoard.css';

const GameBoard = ({ level, onGameComplete, onBackToMenu }) => {
  const [gameState, setGameState] = useState(() => initializeGame(level));
  const [currentTime, setCurrentTime] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState(null);
  const [gameMessage, setGameMessage] = useState('');

  // Timer effect
  useEffect(() => {
    if (!gameState.isComplete) {
      const timer = setInterval(() => {
        setCurrentTime(getGameTime(gameState));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  // Check for game completion
  useEffect(() => {
    if (gameState.isComplete) {
      const score = calculateScore(gameState);
      setGameMessage(`🎉 Congratulations! You completed ${gameState.config.name} level!`);
      
      setTimeout(() => {
        onGameComplete({
          level,
          moves: gameState.moves,
          timeInSeconds: getGameTime(gameState),
          score,
          isOptimal: gameState.moves === gameState.config.minMoves
        });
      }, 2000);
    }
  }, [gameState.isComplete, gameState, level, onGameComplete]);

  const handleTowerClick = (towerIndex) => {
    if (gameState.isComplete || gameState.isMoving) return;

    if (gameState.selectedTower === null) {
      // Select a tower (must have disks)
      if (gameState.towers[towerIndex].length > 0) {
        setGameState({ ...gameState, selectedTower: towerIndex, error: null });
      }
    } else if (gameState.selectedTower === towerIndex) {
      // Deselect the same tower
      setGameState({ ...gameState, selectedTower: null });
    } else {
      // Try to move from selected tower to clicked tower
      const newGameState = makeMove(gameState, gameState.selectedTower, towerIndex);
      
      if (newGameState.error) {
        setGameMessage(newGameState.error);
        setTimeout(() => setGameMessage(''), 2000);
      } else {
        setGameMessage('');
      }
      
      setGameState(newGameState);
    }
  };

  const handleRestart = () => {
    setGameState(initializeGame(level));
    setCurrentTime(0);
    setShowHint(false);
    setHint(null);
    setGameMessage('');
  };

  const handleGetHint = () => {
    if (!showHint) {
      const nextHint = getHint(gameState);
      setHint(nextHint);
      setShowHint(true);
      setTimeout(() => {
        setShowHint(false);
        setHint(null);
      }, 5000);
    }
  };

  return (
    <div className="game-board">
      <div className="game-header">
        <h2>Towers of Hanoi - {gameState.config.name}</h2>
        <p className="game-description">{gameState.config.description}</p>
        {gameMessage && (
          <div className={`game-message ${gameState.error ? 'error' : 'success'}`}>
            {gameMessage}
          </div>
        )}
      </div>

      <GameStats
        moves={gameState.moves}
        time={formatTime(currentTime)}
        minMoves={gameState.config.minMoves}
        level={level}
      />

      <div className="towers-container">
        {gameState.towers.map((tower, index) => (
          <Tower
            key={index}
            tower={tower}
            towerIndex={index}
            selectedTower={gameState.selectedTower}
            onTowerClick={handleTowerClick}
            isMoving={gameState.isMoving}
          />
        ))}
      </div>

      {showHint && hint && (
        <div className="hint-container">
          <div className="hint-message">
            💡 Hint: {hint.message}
          </div>
        </div>
      )}

      <GameControls
        onRestart={handleRestart}
        onHint={handleGetHint}
        onBackToMenu={onBackToMenu}
        isGameComplete={gameState.isComplete}
        canGetHint={!showHint && !gameState.isComplete}
      />

      <div className="game-rules">
        <h4>Rules:</h4>
        <ul>
          <li>Move all disks from Tower 1 to Tower 3</li>
          <li>Only move one disk at a time</li>
          <li>Never place a larger disk on a smaller one</li>
          <li>Minimum moves needed: {gameState.config.minMoves}</li>
        </ul>
      </div>
    </div>
  );
};

export default GameBoard;