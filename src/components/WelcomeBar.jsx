import React from 'react';
import { FACEBOOK_CONFIG } from '../config/facebookConfig';
import '../styles/WelcomeBar.css';

/**
 * Barre de bienvenue permanente et défilante en bas de l'écran.
 * Affiche le message de la commune (arabe) répété, séparé par le
 * drapeau marocain et une étoile, en défilement horizontal continu.
 */
export default function WelcomeBar() {
  const text = FACEBOOK_CONFIG.WELCOME_TEXT;

  // Un motif = message + étoile de séparation.
  const unit = (key) => (
    <span className="welcome-unit" key={key}>
      <span className="welcome-text" dir="rtl">{text}</span>
      <span className="welcome-star">✦</span>
    </span>
  );

  // On répète plusieurs fois, puis on double l'ensemble pour une
  // boucle sans coupure.
  const items = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="welcome-bar">
      <div className="welcome-track">
        {items.map((i) => unit(`a-${i}`))}
        {items.map((i) => unit(`b-${i}`))}
      </div>
    </div>
  );
}
