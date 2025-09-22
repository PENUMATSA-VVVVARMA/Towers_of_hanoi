# Towers of Hanoi Game

A modern implementation of the classic Towers of Hanoi puzzle game built with React and Express.js, featuring a MongoDB-powered leaderboard system.

## 🎮 Game Features

- **3 Difficulty Levels**: Easy (3 disks), Medium (4 disks), Hard (5 disks)
- **Interactive Gameplay**: Click-to-move interface with visual feedback
- **Real-time Timer**: Track your solving time
- **Move Counter**: Monitor your efficiency
- **Hint System**: Get help when stuck
- **Score System**: Points based on time, moves, and level difficulty
- **Global Leaderboard**: Compete with players worldwide
- **Responsive Design**: Works on desktop and mobile devices

## 🏆 Scoring System

- **Base Score**: 1000 points
- **Time Penalty**: -10 points per second
- **Level Bonus**: Easy (+0), Medium (+200), Hard (+500)
- **Optimal Bonus**: +500 points for solving in minimum moves
- **Move Penalty**: -20 points for each extra move beyond optimal

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd towers-of-hanoi-game
   npm install
   ```

2. **Install dependencies for both client and server:**
   ```bash
   npm run install-all
   ```

3. **Configure MongoDB:**
   - For local MongoDB: Update `server/.env` with your MongoDB connection string
   - For MongoDB Atlas: Replace the connection string in `server/.env`

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - React frontend on http://localhost:3000
   - Express backend on http://localhost:5000

### Environment Variables

Create a `server/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/towers_of_hanoi
PORT=5000
NODE_ENV=development
```

## 📁 Project Structure

```
towers-of-hanoi-game/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Game logic and API service
│   │   └── ...
│   └── package.json
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## 🎯 Game Rules

1. **Objective**: Move all disks from the first tower to the last tower
2. **Movement**: Only move one disk at a time
3. **Stacking**: Never place a larger disk on top of a smaller disk
4. **Optimal Solutions**: 
   - Easy (3 disks): 7 moves
   - Medium (4 disks): 15 moves  
   - Hard (5 disks): 31 moves

## 🛠️ Technologies Used

### Frontend
- **React**: User interface
- **CSS3**: Styling and animations
- **Fetch API**: HTTP requests

### Backend
- **Express.js**: Web server framework
- **MongoDB**: Database for score storage
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing

### Development
- **Concurrently**: Run multiple npm scripts
- **Nodemon**: Auto-restart server during development

## 📊 API Endpoints

### Scores
- `POST /api/scores` - Submit a new score
- `GET /api/scores/leaderboard/:level` - Get leaderboard for specific level
- `GET /api/scores/leaderboard` - Get overall leaderboard
- `GET /api/scores/player/:playerName` - Get player's scores
- `GET /api/scores/stats` - Get game statistics

### Health Check
- `GET /api/health` - Server health check

## 🎨 Game Components

### Core Components
- **GameBoard**: Main game interface
- **Tower**: Individual tower with disks
- **GameStats**: Real-time game statistics
- **GameControls**: Game action buttons

### UI Components
- **Leaderboard**: Global rankings display
- **ScoreSubmission**: Score submission form
- **App**: Main application container

## 🔧 Development Commands

```bash
# Install all dependencies
npm run install-all

# Run both client and server in development
npm run dev

# Run only the server
npm run server

# Run only the client
npm run client

# Build client for production
npm run build

# Start production server
npm start
```

## 🎮 How to Play

1. **Select Difficulty**: Choose Easy, Medium, or Hard level
2. **Click Towers**: Click a tower with disks to select it
3. **Make Moves**: Click another tower to move the top disk
4. **Follow Rules**: Ensure larger disks never go on smaller ones
5. **Complete Puzzle**: Move all disks to the rightmost tower
6. **Submit Score**: Enter your name to join the leaderboard

## 🏅 Features Highlight

- **Visual Feedback**: Animated disk movements and tower selection
- **Hint System**: Get suggestions for optimal moves
- **Efficiency Tracking**: Monitor your performance vs optimal solution
- **Responsive Design**: Adapts to different screen sizes
- **Error Handling**: User-friendly error messages and validation
- **Local Storage**: Remembers player name between sessions

## 🚀 Future Enhancements

- User authentication and profiles
- Achievement system and badges  
- Multiplayer competitions
- Custom disk themes and colors
- Tournament mode
- Mobile app version

## 📱 Mobile Support

The game is fully responsive and optimized for mobile devices with:
- Touch-friendly interface
- Adaptive layouts for small screens
- Optimized animations for mobile performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Classic Towers of Hanoi puzzle by Édouard Lucas
- React community for excellent documentation
- MongoDB team for the database platform

---

**Enjoy playing Towers of Hanoi! 🗼**