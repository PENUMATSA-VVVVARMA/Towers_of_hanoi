import React, { useState, useEffect } from 'react';
import ApiService from '../utils/apiService';
import './Leaderboard.css';

const Leaderboard = ({ onClose }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
    fetchStats();
  }, [selectedLevel]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const level = selectedLevel === 'all' ? null : parseInt(selectedLevel);
      const data = await ApiService.getLeaderboard(level, 20);
      setLeaderboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load leaderboard. Please try again.');
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await ApiService.getGameStats();
      setStats(statsData);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelName = (level) => {
    const names = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
    return names[level] || 'Unknown';
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  };

  if (loading) {
    return (
      <div className="leaderboard-overlay">
        <div className="leaderboard-modal">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h2>🏆 Leaderboard</h2>
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
        </div>

        {stats && (
          <div className="game-stats-summary">
            <div className="stat-box">
              <div className="stat-number">{stats.totalGames}</div>
              <div className="stat-label">Total Games</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.uniquePlayers}</div>
              <div className="stat-label">Players</div>
            </div>
          </div>
        )}

        <div className="level-filter">
          <label>Filter by level:</label>
          <select 
            value={selectedLevel} 
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="1">Easy (3 disks)</option>
            <option value="2">Medium (4 disks)</option>
            <option value="3">Hard (5 disks)</option>
          </select>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchLeaderboard}>Retry</button>
          </div>
        )}

        <div className="leaderboard-content">
          {leaderboardData.length === 0 ? (
            <div className="no-scores">
              <p>No scores yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="leaderboard-table">
              <div className="table-header">
                <div className="rank-col">Rank</div>
                <div className="name-col">Player</div>
                <div className="level-col">Level</div>
                <div className="score-col">Score</div>
                <div className="moves-col">Moves</div>
                <div className="time-col">Time</div>
                <div className="date-col">Date</div>
              </div>
              
              {leaderboardData.map((score, index) => (
                <div 
                  key={score._id} 
                  className={`table-row ${score.isOptimal ? 'optimal' : ''}`}
                >
                  <div className="rank-col rank">
                    {getRankEmoji(index + 1)}
                  </div>
                  <div className="name-col player-name">
                    {score.playerName}
                    {score.isOptimal && <span className="optimal-badge">⚡</span>}
                  </div>
                  <div className="level-col level-badge">
                    {getLevelName(score.level)}
                  </div>
                  <div className="score-col score">
                    {score.score.toLocaleString()}
                  </div>
                  <div className="moves-col moves">
                    {score.moves}
                  </div>
                  <div className="time-col time">
                    {formatTime(score.timeInSeconds)}
                  </div>
                  <div className="date-col date">
                    {new Date(score.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="leaderboard-legend">
          <div className="legend-item">
            <span className="optimal-badge">⚡</span>
            <span>Optimal solution (minimum moves)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;