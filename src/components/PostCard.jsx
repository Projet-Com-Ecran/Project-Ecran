import React from 'react';
import '../styles/PostCard.css';

export default function PostCard({ post, isActive }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text, maxChars = 500) => {
    if (text.length > maxChars) {
      return text.substring(0, maxChars) + '...';
    }
    return text;
  };

  return (
    <div className={`post-card ${isActive ? 'active' : ''}`}>
      {/* Image du post */}
      {post.image && (
        <div className="post-image-container">
          <img src={post.image} alt="Post" className="post-image" />
        </div>
      )}

      {/* Contenu texte */}
      <div className="post-content">
        <h2 className="post-title">Publication Facebook</h2>

        {post.message && (
          <div className="post-message">
            <p>{truncateText(post.message)}</p>
          </div>
        )}

        {/* Métadonnées */}
        <div className="post-metadata">
          <div className="post-date">
            <span className="icon">📅</span>
            <span>{formatDate(post.createdTime)}</span>
          </div>

          <div className="post-stats">
            {post.likes !== null && (
              <div className="stat">
                <span className="icon">👍</span>
                <span>{post.likes.toLocaleString('fr-FR')}</span>
              </div>
            )}
            {post.comments !== null && (
              <div className="stat">
                <span className="icon">💬</span>
                <span>{post.comments.toLocaleString('fr-FR')}</span>
              </div>
            )}
            {post.shares !== null && (
              <div className="stat">
                <span className="icon">↗️</span>
                <span>{post.shares.toLocaleString('fr-FR')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lien vers le post original */}
        <div className="post-link">
          <a href={post.permalink} target="_blank" rel="noopener noreferrer">
            Voir sur Facebook
          </a>
        </div>
      </div>

      {/* Indicateur de progression */}
      <div className="post-progress-bar"></div>
    </div>
  );
}
