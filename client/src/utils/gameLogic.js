// Game configuration for different difficulty levels
export const GAME_CONFIG = {
  1: { // Easy
    disks: 3,
    minMoves: 7, // 2^3 - 1
    name: 'Easy',
    description: '3 disks - Learn the basics'
  },
  2: { // Medium
    disks: 4,
    minMoves: 15, // 2^4 - 1
    name: 'Medium',
    description: '4 disks - Getting challenging'
  },
  3: { // Hard
    disks: 5,
    minMoves: 31, // 2^5 - 1
    name: 'Hard',
    description: '5 disks - Master level'
  }
};

// Initialize game state for a given level
export const initializeGame = (level) => {
  const config = GAME_CONFIG[level];
  if (!config) throw new Error(`Invalid level: ${level}`);

  // Create towers: [source, auxiliary, destination]
  const towers = [[], [], []];
  
  // Add disks to the first tower (largest to smallest, bottom to top)
  for (let i = config.disks; i >= 1; i--) {
    towers[0].push(i);
  }

  return {
    towers,
    moves: 0,
    timeStart: Date.now(),
    timeEnd: null,
    isComplete: false,
    level,
    config,
    selectedTower: null,
    isMoving: false
  };
};

// Check if a move is valid
export const isValidMove = (gameState, fromTower, toTower) => {
  const { towers } = gameState;
  
  // Can't move from empty tower
  if (towers[fromTower].length === 0) return false;
  
  // Can't move to the same tower
  if (fromTower === toTower) return false;
  
  // Get the top disks
  const movingDisk = towers[fromTower][towers[fromTower].length - 1];
  const targetDisk = towers[toTower][towers[toTower].length - 1];
  
  // Can place on empty tower or on larger disk
  return targetDisk === undefined || movingDisk < targetDisk;
};

// Execute a move
export const makeMove = (gameState, fromTower, toTower) => {
  if (!isValidMove(gameState, fromTower, toTower)) {
    return { ...gameState, error: 'Invalid move!' };
  }

  const newTowers = gameState.towers.map(tower => [...tower]);
  const movingDisk = newTowers[fromTower].pop();
  newTowers[toTower].push(movingDisk);

  const newMoves = gameState.moves + 1;
  const isComplete = checkWinCondition(newTowers, gameState.config.disks);
  
  const newState = {
    ...gameState,
    towers: newTowers,
    moves: newMoves,
    isComplete,
    timeEnd: isComplete ? Date.now() : null,
    selectedTower: null,
    error: null
  };

  return newState;
};

// Check if the game is won
export const checkWinCondition = (towers, totalDisks) => {
  // All disks should be on the last tower (index 2)
  const lastTower = towers[2];
  
  if (lastTower.length !== totalDisks) return false;
  
  // Check if disks are in correct order (largest to smallest)
  for (let i = 0; i < lastTower.length - 1; i++) {
    if (lastTower[i] <= lastTower[i + 1]) return false;
  }
  
  return true;
};

// Calculate game score
export const calculateScore = (gameState) => {
  if (!gameState.isComplete || !gameState.timeEnd) return 0;

  const timeInSeconds = (gameState.timeEnd - gameState.timeStart) / 1000;
  const { moves, level, config } = gameState;
  
  const baseScore = 1000;
  const timePenalty = Math.floor(timeInSeconds) * 10;
  const levelBonus = level === 1 ? 0 : level === 2 ? 200 : 500;
  const isOptimal = moves === config.minMoves;
  const optimalBonus = isOptimal ? 500 : 0;
  const movesPenalty = moves > config.minMoves ? (moves - config.minMoves) * 20 : 0;
  
  return Math.max(baseScore - timePenalty + levelBonus + optimalBonus - movesPenalty, 0);
};

// Get game time in seconds
export const getGameTime = (gameState) => {
  if (!gameState.timeStart) return 0;
  const endTime = gameState.timeEnd || Date.now();
  return Math.floor((endTime - gameState.timeStart) / 1000);
};

// Auto-solve function (for demonstration/hints)
export const autoSolve = (disks, source = 0, destination = 2, auxiliary = 1) => {
  const moves = [];
  
  const hanoi = (n, from, to, aux) => {
    if (n === 1) {
      moves.push({ from, to, disk: n });
    } else {
      hanoi(n - 1, from, aux, to);
      moves.push({ from, to, disk: n });
      hanoi(n - 1, aux, to, from);
    }
  };
  
  hanoi(disks, source, destination, auxiliary);
  return moves;
};

// Get hint for next optimal move
export const getHint = (gameState) => {
  const { towers, moves, config } = gameState;
  const optimalMoves = autoSolve(config.disks);
  
  if (moves < optimalMoves.length) {
    const nextMove = optimalMoves[moves];
    return {
      from: nextMove.from,
      to: nextMove.to,
      message: `Move disk from Tower ${nextMove.from + 1} to Tower ${nextMove.to + 1}`
    };
  }
  
  return null;
};

// Format time as MM:SS
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};