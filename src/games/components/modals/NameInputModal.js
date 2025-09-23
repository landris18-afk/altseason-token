import React, { useState } from 'react';
import './NameInputModal.css';

const NameInputModal = ({ isOpen, onClose, onConfirm }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (playerName.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    
    if (playerName.trim().length > 20) {
      setError('Name must be less than 20 characters');
      return;
    }
    
    setError('');
    onConfirm(playerName.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="name-modal-overlay">
      <div className="name-modal-container">
        <div className="name-modal-header">
          <h2 className="name-modal-title">Enter Your Name</h2>
          <p className="name-modal-subtitle">What should we call you, champion?</p>
        </div>
        
        <form className="name-modal-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name..."
              className="name-input"
              maxLength={20}
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="confirm-btn"
              disabled={!playerName.trim()}
            >
              Start Game!
            </button>
          </div>
        </form>
        
        <div className="name-modal-tips">
          <p>Choose a name that will make you famous on the leaderboard!</p>
        </div>
      </div>
    </div>
  );
};

export default NameInputModal;
