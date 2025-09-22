const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Towers of Hanoi server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});