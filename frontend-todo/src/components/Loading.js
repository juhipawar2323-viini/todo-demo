import React from 'react';

export const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <div
      className="loading-wrapper animate-fade-in"
      style={fullScreen ? { minHeight: '60vh' } : {}}
      id="loading-indicator"
    >
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};
