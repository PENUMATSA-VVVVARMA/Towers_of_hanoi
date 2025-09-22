const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Calculate score based on moves, time, and level
const calculateScore = (moves, timeInSeconds, level, isOptimal) => {
  const baseScore = 1000;
  const timePenalty = Math.floor(timeInSeconds) * 10;
  const levelBonus = level === 1 ? 0 : level === 2 ? 200 : 500;
  const optimalBonus = isOptimal ? 500 : 0;
  const movesPenalty = moves > getOptimalMoves(level) ? (moves - getOptimalMoves(level)) * 20 : 0;
  
  return Math.max(baseScore - timePenalty + levelBonus + optimalBonus - movesPenalty, 0);
};

// Get optimal moves for each level
const getOptimalMoves = (level) => {
  const disks = level + 2; // Easy: 3, Medium: 4, Hard: 5
  return Math.pow(2, disks) - 1;
};

// POST /api/scores - Submit a new score
router.post('/', async (req, res) => {
  try {
    const { playerName, level, moves, timeInSeconds } = req.body;

    // Validation
    if (!playerName || !level || moves === undefined || timeInSeconds === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: playerName, level, moves, timeInSeconds' 
      });
    }

    if (level < 1 || level > 3) {
      return res.status(400).json({ error: 'Level must be 1, 2, or 3' });
    }

    if (moves < 0 || timeInSeconds < 0) {
      return res.status(400).json({ error: 'Moves and time must be non-negative' });
    }

    const optimalMoves = getOptimalMoves(level);
    const isOptimal = moves === optimalMoves;
    const score = calculateScore(moves, timeInSeconds, level, isOptimal);

    const newScore = new Score({
      playerName,
      level,
      moves,
      timeInSeconds,
      score,
      isOptimal
    });

    const savedScore = await newScore.save();
    res.status(201).json(savedScore);
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// GET /api/scores/leaderboard/:level - Get leaderboard for specific level
router.get('/leaderboard/:level', async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    const limit = parseInt(req.query.limit) || 10;

    if (level < 1 || level > 3) {
      return res.status(400).json({ error: 'Level must be 1, 2, or 3' });
    }

    const scores = await Score.find({ level })
      .sort({ score: -1, createdAt: 1 }) // Highest score first, then oldest
      .limit(limit)
      .select('-__v');

    res.json(scores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/scores/leaderboard - Get overall leaderboard (all levels)
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;

    const scores = await Score.find()
      .sort({ score: -1, createdAt: 1 })
      .limit(limit)
      .select('-__v');

    res.json(scores);
  } catch (error) {
    console.error('Error fetching overall leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/scores/player/:playerName - Get player's best scores
router.get('/player/:playerName', async (req, res) => {
  try {
    const { playerName } = req.params;

    const scores = await Score.find({ playerName })
      .sort({ level: 1, score: -1 })
      .select('-__v');

    // Get best score for each level
    const bestScores = {};
    scores.forEach(score => {
      if (!bestScores[score.level] || score.score > bestScores[score.level].score) {
        bestScores[score.level] = score;
      }
    });

    res.json({
      playerName,
      bestScores: Object.values(bestScores),
      totalGames: scores.length
    });
  } catch (error) {
    console.error('Error fetching player scores:', error);
    res.status(500).json({ error: 'Failed to fetch player scores' });
  }
});

// GET /api/scores/stats - Get game statistics
router.get('/stats', async (req, res) => {
  try {
    const totalGames = await Score.countDocuments();
    const uniquePlayers = await Score.distinct('playerName').then(names => names.length);
    
    const levelStats = await Score.aggregate([
      {
        $group: {
          _id: '$level',
          totalGames: { $sum: 1 },
          avgMoves: { $avg: '$moves' },
          avgTime: { $avg: '$timeInSeconds' },
          bestScore: { $max: '$score' },
          optimalSolutions: { $sum: { $cond: ['$isOptimal', 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalGames,
      uniquePlayers,
      levelStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;