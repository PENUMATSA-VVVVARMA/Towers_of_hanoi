const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Submit a new score
  static async submitScore(scoreData) {
    try {
      const submitUrl = `${API_BASE_URL}/scores`;
      console.log('Submitting score to URL:', submitUrl); // Debug log
      console.log('Score data:', scoreData); // Debug log
      
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      });

      console.log('Submit response:', response.status, response.statusText); // Debug log

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          console.warn('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Submit successful:', result); // Debug log
      return result;
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
      // Construct health endpoint URL correctly
      const baseUrl = API_BASE_URL.replace('/api', ''); // Remove /api from base URL
      const healthUrl = `${baseUrl}/api/health`;
      console.log('Testing connection to:', healthUrl); // Debug log
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Health check response:', response.status, response.statusText); // Debug log
      return response.ok;
    } catch (error) {
      console.error('Server connection test failed:', error);
      return false;
    }
  }
}

export default ApiService;