const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Submit a new score
  static async submitScore(scoreData) {
    try {
      const response = await fetch(`${API_BASE_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit score');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }

  // Get leaderboard for a specific level
  static async getLeaderboard(level, limit = 10) {
    try {
      const url = level 
        ? `${API_BASE_URL}/scores/leaderboard/${level}?limit=${limit}`
        : `${API_BASE_URL}/scores/leaderboard?limit=${limit}`;
        
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  // Get player's best scores
  static async getPlayerScores(playerName) {
    try {
      const response = await fetch(`${API_BASE_URL}/scores/player/${encodeURIComponent(playerName)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch player scores');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching player scores:', error);
      throw error;
    }
  }

  // Get game statistics
  static async getGameStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/scores/stats`);

      if (!response.ok) {
        throw new Error('Failed to fetch game statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching game stats:', error);
      throw error;
    }
  }

  // Test server connection
  static async testConnection() {
    try {
      // Try the health endpoint
      const healthUrl = `${API_BASE_URL}/health`.replace('/api/api/', '/api/');
      console.log('Testing connection to:', healthUrl); // Debug log
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Health check response:', response.status); // Debug log
      return response.ok;
    } catch (error) {
      console.error('Server connection test failed:', error);
      return false;
    }
  }
}

export default ApiService;