// Detect if we're in production or mobile environment
const isProduction = process.env.NODE_ENV === 'production' || 
  window.location.protocol === 'https:' ||
  !window.location.hostname.includes('localhost');

// Try multiple possible backend URLs (filter localhost for production/mobile)
const POSSIBLE_API_URLS = [
  process.env.REACT_APP_API_URL,
  'https://towers-of-hanoi-api.onrender.com/api',
  'https://towers-hanoi-server.onrender.com/api', 
  'https://hanoi-backend.onrender.com/api',
  // Only include localhost if we're in development
  ...(!isProduction ? ['http://localhost:5000/api'] : [])
].filter(Boolean);

let API_BASE_URL = POSSIBLE_API_URLS[0] || 'https://towers-of-hanoi-api.onrender.com/api';
console.log('Environment detection:', { 
  isProduction, 
  hostname: window.location.hostname,
  protocol: window.location.protocol 
});
console.log('Available API URLs for this environment:', POSSIBLE_API_URLS);
console.log('Primary API URL:', API_BASE_URL);

class ApiService {
  // Submit a new score with fallback URL attempts
  static async submitScore(scoreData) {
    let lastError = null;
    
    // Try current API_BASE_URL first, then try all possible URLs
    const urlsToTry = [API_BASE_URL, ...POSSIBLE_API_URLS.filter(url => url !== API_BASE_URL)];
    
    for (const apiUrl of urlsToTry) {
      try {
        const submitUrl = `${apiUrl}/scores`;
        console.log('Attempting to submit score to:', submitUrl);
        console.log('Score data:', scoreData);
        
        const response = await fetch(submitUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scoreData),
          // Add timeout for mobile networks
          signal: AbortSignal.timeout(15000) // 15 second timeout
        });

        console.log('Submit response:', response.status, response.statusText);

        if (response.ok) {
          // Success! Update API_BASE_URL for future requests
          API_BASE_URL = apiUrl;
          const result = await response.json();
          console.log('✅ Score submitted successfully:', result);
          return result;
        } else if (response.status === 404) {
          throw new Error('API endpoint not found - backend may not be deployed');
        }
      } catch (error) {
        console.warn(`Failed to submit to ${apiUrl}:`, error.message);
        lastError = error;
        continue; // Try next URL
      }
    }
    
    // All attempts failed
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const errorMessage = `Unable to submit score. Backend service appears to be unavailable.\n\n🔧 Possible solutions:\n${isMobile ? '📱 Mobile: Check your mobile data/WiFi connection\n' : ''}1. Check if backend is deployed on Render\n2. Verify backend service isn't sleeping\n3. Try again in a few seconds\n\nTechnical details: ${lastError?.message || 'All connection attempts failed'}`;
    throw new Error(errorMessage);
  }

  // Get leaderboard for a specific level with fallback URL attempts
  static async getLeaderboard(level, limit = 10) {
    let lastError = null;
    
    // Try current API_BASE_URL first, then try all possible URLs
    const urlsToTry = [API_BASE_URL, ...POSSIBLE_API_URLS.filter(url => url !== API_BASE_URL)];
    
    for (const apiUrl of urlsToTry) {
      try {
        const url = level 
          ? `${apiUrl}/scores/leaderboard/${level}?limit=${limit}`
          : `${apiUrl}/scores/leaderboard?limit=${limit}`;
        
        console.log('Attempting to fetch leaderboard from:', url);
        const response = await fetch(url, {
          // Add timeout for mobile networks
          signal: AbortSignal.timeout(15000) // 15 second timeout
        });
        console.log('Leaderboard response:', response.status, response.statusText);

        if (response.ok) {
          // Success! Update API_BASE_URL for future requests
          API_BASE_URL = apiUrl;
          const data = await response.json();
          console.log('✅ Leaderboard data fetched:', data);
          return data;
        }
      } catch (error) {
        console.warn(`Failed to fetch leaderboard from ${apiUrl}:`, error.message);
        lastError = error;
        continue; // Try next URL
      }
    }
    
    // All attempts failed - throw meaningful error
    throw new Error(`Backend service unavailable. Please check if the server is deployed and running.\n\nTechnical details: ${lastError?.message || 'All connection attempts failed'}`);
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

  // Test server connection with multiple URL attempts
  static async testConnection() {
    for (let i = 0; i < POSSIBLE_API_URLS.length; i++) {
      const apiUrl = POSSIBLE_API_URLS[i];
      try {
        const baseUrl = apiUrl.replace('/api', '');
        const healthUrl = `${baseUrl}/api/health`;
        console.log(`Attempt ${i + 1}: Testing connection to:`, healthUrl);
        
        const response = await fetch(healthUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout for mobile networks
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        console.log(`Attempt ${i + 1} response:`, response.status, response.statusText);
        
        if (response.ok) {
          // Update the working API URL for future requests
          API_BASE_URL = apiUrl;
          console.log('✅ Found working API URL:', API_BASE_URL);
          return true;
        }
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed:`, error.message);
        continue; // Try next URL
      }
    }
    
    console.error('❌ All API connection attempts failed');
    return false;
  }
}

export default ApiService;