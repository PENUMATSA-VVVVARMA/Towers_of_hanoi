import React from 'react';
import './Tower.css';

const Tower = ({ tower, towerIndex, selectedTower, onTowerClick, isMoving }) => {
  const handleClick = () => {
    if (!isMoving) {
      onTowerClick(towerIndex);
    }
  };

  const isSelected = selectedTower === towerIndex;
  const canSelect = tower.length > 0 || selectedTower !== null;

  return (
    <div className="tower-container">
      <div className="tower-label">Tower {towerIndex + 1}</div>
      <div 
        className={`tower ${isSelected ? 'selected' : ''} ${canSelect ? 'clickable' : ''}`}
        onClick={handleClick}
      >
        <div className="tower-pole"></div>
        <div className="tower-base"></div>
        <div className="disks-container">
          {tower.map((diskSize, index) => (
            <div
              key={`disk-${diskSize}-${index}`}
              className={`disk disk-${diskSize} ${
                index === tower.length - 1 && isSelected ? 'highlighted' : ''
              }`}
              style={{
                bottom: `${20 + index * 25}px`,
                width: `${40 + diskSize * 20}px`,
                backgroundColor: getDiskColor(diskSize),
              }}
            >
              {diskSize}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Get color for disk based on size
const getDiskColor = (size) => {
  const colors = {
    1: '#FF6B6B', // Red
    2: '#4ECDC4', // Teal
    3: '#45B7D1', // Blue
    4: '#96CEB4', // Green
    5: '#FFEAA7', // Yellow
  };
  return colors[size] || '#DDD';
};

export default Tower;