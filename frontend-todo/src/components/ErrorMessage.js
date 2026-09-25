import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-banner animate-fade-in" role="alert" id="error-message-banner">
      <AlertCircle className="error-banner-icon" size={20} />
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          id="error-retry-btn"
        >
          <RotateCw size={13} />
          Retry
        </button>
      )}
    </div>
  );
};
