import React from 'react';
import '../styles/ErrorScreen.css';

export default function ErrorScreen({ error, onRetry }) {
  return (
    <div className="error-screen">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h1>Erreur</h1>
        <p className="error-message">{error}</p>

        <div className="error-details">
          <h3>Vérifications à effectuer:</h3>
          <ul>
            <li>✓ ACCESS_TOKEN configuré (VITE_FACEBOOK_ACCESS_TOKEN)</li>
            <li>✓ PAGE_ID configuré (VITE_FACEBOOK_PAGE_ID)</li>
            <li>✓ Connexion internet disponible</li>
            <li>✓ Le token Facebook est valide et non expiré</li>
            <li>✓ Les permissions de lecture de la page sont accordées</li>
          </ul>
        </div>

        <div className="error-actions">
          <button onClick={onRetry} className="retry-button">
            Réessayer
          </button>
          <a
            href="https://developers.facebook.com/docs/graph-api"
            target="_blank"
            rel="noopener noreferrer"
            className="help-link"
          >
            Documentation Facebook API
          </a>
        </div>
      </div>
    </div>
  );
}
