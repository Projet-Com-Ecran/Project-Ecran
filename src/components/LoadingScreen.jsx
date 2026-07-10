import React from 'react';
import '../styles/LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="spinner"></div>
        <h1>Facebook TV Display</h1>
        <p>Chargement des publications...</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
