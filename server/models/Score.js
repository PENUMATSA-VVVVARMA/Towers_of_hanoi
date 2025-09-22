const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  moves: {
    type: Number,
    required: true,
    min: 0
  },
  timeInSeconds: {
    type: Number,
    required: true,
    min: 0
  },
  score: {
    type: Number,
    required: true
  },
  isOptimal: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient leaderboard queries
scoreSchema.index({ level: 1, score: -1 });
scoreSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Score', scoreSchema);