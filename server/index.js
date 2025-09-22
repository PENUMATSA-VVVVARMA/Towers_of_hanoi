const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://towers-of-hanoi-staticsite.onrender.com'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/towers_of_hanoi';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/scores', require('./routes/scores'));

// Health check endpoint - comprehensive for production
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Get basic system info
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'Towers of Hanoi API',
      version: '1.0.0',
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'towers_of_hanoi'
      },
      environment: process.env.NODE_ENV || 'development',
      port: PORT
    };

    // If database is connected, add more details
    if (dbStatus === 'connected') {
      try {
        // Test database query
        const Score = require('./models/Score');
        const scoreCount = await Score.countDocuments();
        healthCheck.database.totalScores = scoreCount;
      } catch (err) {
        healthCheck.database.queryStatus = 'error';
        healthCheck.database.error = err.message;
      }
    }

    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'Towers of Hanoi API',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Towers of Hanoi API',
    endpoints: {
      health: '/api/health',
      scores: '/api/scores',
      leaderboard: '/api/scores/leaderboard',
      stats: '/api/scores/stats'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});