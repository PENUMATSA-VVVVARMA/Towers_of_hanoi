import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import ScoreSubmission from './components/ScoreSubmission';
import ApiService from './utils/apiService';
import { GAME_CONFIG } from './utils/gameLogic';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'game', 'leaderboard'
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);

  // Check server connection on app start
  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const connected = await ApiService.testConnection();
      setServerConnected(connected);
    } catch (error) {
      setServerConnected(false);
    }
  };

  const handleStartGame = (level) => {
    setSelectedLevel(level);
    setCurrentView('game');
  };

  const handleGameComplete = (result) => {
    setGameResult(result);
    setShowScoreSubmission(true);
  };

  const handleScoreSubmitted = () => {
    setShowScoreSubmission(false);
    setCurrentView('leaderboard');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedLevel(null);
    setGameResult(null);
    setShowScoreSubmission(false);
  };

  const handleScoreSubmissionClose = () => {
    setShowScoreSubmission(false);
    // Go back to menu instead of staying on the same page
    handleBackToMenu();
  };

  const renderMenu = () => (
    <div className="app-container">
      <div className="menu-container">
        <div className="game-header">
          <h1 className="game-title">🗼 Towers of Hanoi</h1>
          <p className="game-subtitle">Challenge yourself with this classic puzzle game</p>
        </div>

        {!serverConnected && (
          <div className="server-warning">
            ⚠️ Server not connected. Leaderboard features may not work.
            <button onClick={checkServerConnection} className="retry-button">
              Retry Connection
            </button>
          </div>
        )}

        <div className="level-selection">
          <h2>Choose Your Challenge</h2>
          <div className="level-cards">
            {Object.entries(GAME_CONFIG).map(([level, config]) => (
              <div key={level} className="level-card">
                <div className="level-header">
                  <h3>{config.name}</h3>
                  <div className="level-icon">
                    {level === '1' ? '🟢' : level === '2' ? '🟡' : '🔴'}
                  </div>
                </div>
                <div className="level-info">
                  <p>{config.description}</p>
                  <div className="level-stats">
                    <div className="stat">
                      <strong>{config.disks}</strong> disks
                    </div>
                    <div className="stat">
                      Min <strong>{config.minMoves}</strong> moves
                    </div>
                  </div>
                </div>
                <button
                  className={`level-button level-${level}`}
                  onClick={() => handleStartGame(parseInt(level))}
                >
                  Play {config.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="menu-actions">
          <button
            className="action-button secondary"
            onClick={() => setCurrentView('leaderboard')}
            disabled={!serverConnected}
          >
            🏆 View Leaderboard
          </button>
        </div>

        <div className="game-rules">
          <h3>How to Play</h3>
          <div className="rules-grid">
            <div className="rule">
              <div className="rule-icon">🎯</div>
              <div className="rule-text">
                <strong>Goal:</strong> Move all disks from the first tower to the last tower
              </div>
            </div>
            <div className="rule">
              <div className="rule-icon">☝️</div>
              <div className="rule-text">
                <strong>Rule 1:</strong> Only move one disk at a time
              </div>
            </div>
            <div className="rule">
              <div className="rule-icon">⛔</div>
              <div className="rule-text">
                <strong>Rule 2:</strong> Never place a larger disk on a smaller one
              </div>
            </div>
            <div className="rule">
              <div className="rule-icon">⚡</div>
              <div className="rule-text">
                <strong>Challenge:</strong> Complete in minimum moves for bonus points
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      {currentView === 'menu' && renderMenu()}
      
      {currentView === 'game' && (
        <GameBoard
          level={selectedLevel}
          onGameComplete={handleGameComplete}
          onBackToMenu={handleBackToMenu}
        />
      )}
      
      {currentView === 'leaderboard' && (
        <Leaderboard onClose={handleBackToMenu} />
      )}
      
      {showScoreSubmission && gameResult && (
        <ScoreSubmission
          gameResult={gameResult}
          onClose={handleScoreSubmissionClose}
          onSubmitted={handleScoreSubmitted}
        />
      )}
    </div>
  );
}

export default App;
