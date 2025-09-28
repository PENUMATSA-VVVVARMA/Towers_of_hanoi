const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('API Base URL:', API_BASE_URL); // Debug log
console.log('Environment:', process.env.NODE_ENV); // Debug log

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
        
        // Specific handling for common production deployment issues
        if (response.status === 404) {
          errorMessage = `API endpoint not found. Please check if your backend service is deployed and the API URL is correct.\nCurrent API URL: ${API_BASE_URL}`;
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please check if your backend service is running properly.';
        } else if (response.status === 0 || response.status >= 500) {
          errorMessage = `Cannot connect to server. Please verify:\n1. Backend service is deployed and running\n2. API URL is correct: ${API_BASE_URL}\n3. CORS is configured properly`;
        }
        
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // If we can't parse the error response, use our custom message
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
      
      console.log('Fetching leaderboard from URL:', url); // Debug log
      const response = await fetch(url);
      console.log('Leaderboard response:', response.status, response.statusText); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Leaderboard error response:', errorText);
        throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Leaderboard data:', data); // Debug log
      return data;
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