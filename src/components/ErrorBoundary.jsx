import React from 'react';
import DefaultVideo from './DefaultVideo';

/**
 * Capture toute erreur JavaScript survenant dans l'arbre React
 * (interruption de code) et bascule sur la vidéo de secours
 * au lieu d'afficher un écran blanc.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Interruption capturée, bascule sur la vidéo par défaut:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <DefaultVideo />;
    }
    return this.props.children;
  }
}
