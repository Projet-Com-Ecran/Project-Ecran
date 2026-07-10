import React from 'react';
import '../styles/DefaultVideo.css';

/**
 * Vidéo de secours affichée en plein écran, en boucle, quand l'app
 * rencontre une erreur (API indisponible, aucun post…) ou une
 * interruption inattendue. Évite un écran noir / message d'erreur
 * sur l'affichage public.
 */
export default function DefaultVideo() {
  return (
    <div className="default-video">
      <video
        className="default-video-el"
        src="/default.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
