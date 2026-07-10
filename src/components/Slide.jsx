import React, { useRef, useEffect, useCallback } from 'react';
import ScrollingText from './ScrollingText';
import '../styles/Slide.css';

/**
 * Une slide plein écran de style panneau publicitaire.
 * - Vidéo : lecture automatique (muette) quand la slide est active.
 *   Elle va jusqu'à sa fin NATURELLE (onEnded), sans coupure prématurée.
 *   Une sécurité basée sur la durée réelle prend le relais si l'événement
 *   de fin ne se déclenche pas.
 * - Image : affichée en entier (contain) sur un fond flou de remplissage.
 * - Album : toutes les images affichées ensemble dans une grille.
 */
export default function Slide({ post, isActive, onEnded }) {
  const videoRef = useRef(null);
  const safetyRef = useRef(null);
  const endedRef = useRef(false);

  // Avance au post suivant, une seule fois par lecture.
  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    clearTimeout(safetyRef.current);
    if (onEnded) onEnded();
  }, [onEnded]);

  // Lance la lecture quand la vidéo active est montée
  // (au cas où l'attribut autoPlay serait bloqué par le navigateur).
  useEffect(() => {
    if (post.type !== 'video' || !isActive) return;
    endedRef.current = false;
    const video = videoRef.current;
    if (video) {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    }
    return () => clearTimeout(safetyRef.current);
  }, [isActive, post.type]);

  // Une fois la durée connue, programme une sécurité = durée réelle + 4 s.
  const handleLoadedMetadata = (e) => {
    const d = e.target.duration;
    const ms = d && isFinite(d) && d > 0 ? d * 1000 + 4000 : 120000;
    clearTimeout(safetyRef.current);
    safetyRef.current = setTimeout(finish, ms);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  // Image de fond floue (remplit l'écran derrière le média affiché en entier).
  const fillImage = post.type === 'video' ? post.poster : post.url;

  const hasAlbum = post.medias && post.medias.length > 1;
  const hasAlbumWithText = hasAlbum && post.message;

  return (
    <div className={`slide ${isActive ? 'active' : ''} ${hasAlbumWithText ? 'slide--album-text' : ''}`}>
      {/* Fond flou de remplissage */}
      {!hasAlbumWithText && (fillImage ? (
        <div className="slide-fill" style={{ backgroundImage: `url(${fillImage})` }} />
      ) : (
        <div className="slide-fill slide-fill--gradient" />
      ))}

      {/* Média affiché en entier */}
      <div className="slide-stage">
        {/* Vidéo : chargée et jouée uniquement quand la slide est active
            (évite que toutes les vidéos se téléchargent en même temps et
            saturent la bande passante → plus de lecture saccadée). */}
        {post.type === 'video' && isActive && (
          <video
            ref={videoRef}
            className="slide-media"
            src={post.url}
            poster={post.poster || undefined}
            autoPlay
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={finish}
            onError={finish}
          />
        )}

        {/* Slide vidéo non active : on montre seulement l'aperçu (poster). */}
        {post.type === 'video' && !isActive && post.poster && (
          <img className="slide-media" src={post.poster} alt="Aperçu vidéo" />
        )}

        {/* Album : afficher toutes les images dans une grille */}
        {post.type === 'image' && post.medias && post.medias.length > 1 && (
          <div className="slide-gallery">
            {post.medias.map((media, idx) => (
              <img
                key={idx}
                className="slide-gallery-item"
                src={media.url}
                alt={`Image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image seule */}
        {post.type === 'image' && (!post.medias || post.medias.length <= 1) && (
          <img className="slide-media" src={post.url} alt="Publication" />
        )}

        {post.type === 'text' && (
          <div className="slide-textonly">
            <ScrollingText text={post.message} active={isActive} />
          </div>
        )}
      </div>

      {/* Voile dégradé pour la lisibilité */}
      <div className="slide-overlay" />

      {/* Contenu texte en surimpression */}
      <div className="slide-content">
        {post.type !== 'text' && post.message && (
          <div className="slide-message">
            <ScrollingText text={post.message} active={isActive} />
          </div>
        )}

        <div className="slide-meta">
          <div className="slide-stats">
            {post.likes !== null && (
              <span className="slide-stat">👍 {post.likes.toLocaleString('fr-FR')}</span>
            )}
            {post.comments !== null && (
              <span className="slide-stat">💬 {post.comments.toLocaleString('fr-FR')}</span>
            )}
            {post.shares !== null && (
              <span className="slide-stat">↗️ {post.shares.toLocaleString('fr-FR')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
