import React, { useState, useEffect, useCallback, useRef } from 'react';
import Slide from './components/Slide';
import StatusBar from './components/StatusBar';
import WelcomeBar from './components/WelcomeBar';
import DefaultVideo from './components/DefaultVideo';
import { createFacebookService } from './services/facebookService';
import { validateConfig, FACEBOOK_CONFIG } from './config/facebookConfig';
import logo from './assets/logo.png';
import './App.css';

// Durée d'affichage d'une slide image/texte.
// - Sans texte (image seule)  → durée courte (SLIDE_DURATION).
// - Avec texte                → reste plus longtemps : un minimum de lecture
//   + un temps proportionnel à la longueur, plafonné.
const imageDuration = (message) => {
  const len = message ? message.trim().length : 0;
  if (len === 0) return FACEBOOK_CONFIG.SLIDE_DURATION;

  const {
    SLIDE_DURATION,
    TEXT_SLIDE_MIN,
    TEXT_READING_PER_CHAR,
    TEXT_SLIDE_MAX,
  } = FACEBOOK_CONFIG;

  const reading = SLIDE_DURATION + len * TEXT_READING_PER_CHAR;
  return Math.min(Math.max(TEXT_SLIDE_MIN, reading), TEXT_SLIDE_MAX);
};

export default function App() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const facebookService = useRef(null);
  const slideTimerRef = useRef(null);
  const refreshTimerRef = useRef(null);

  // Initialiser le service Facebook
  useEffect(() => {
    if (!validateConfig()) {
      setError('Configuration manquante. Veuillez définir les variables d\'environnement.');
      setLoading(false);
      return;
    }

    facebookService.current = createFacebookService();
    fetchPosts();
  }, []);

  // Récupérer les posts Facebook (déjà aplatis en slides média)
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!facebookService.current) {
        throw new Error('Service Facebook non initialisé');
      }

      const data = await facebookService.current.getPosts();

      if (data.length === 0) {
        setError('Aucun post trouvé sur cette page.');
        return;
      }

      setSlides(data);
      setCurrentIndex(0);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Erreur:', err);
    }
  }, []);

  // Passe à la slide suivante (boucle infinie).
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (slides.length ? (prev + 1) % slides.length : 0));
  }, [slides.length]);

  // Rotation automatique :
  // - image / texte → durée adaptée à la longueur du texte (temps de lecture)
  // - vidéo → PAS de minuteur ici : la slide vidéo avance elle-même
  //   à la fin de la lecture (onEnded / sécurité basée sur sa durée).
  useEffect(() => {
    if (slides.length === 0) return;

    const current = slides[currentIndex];
    if (current?.type === 'video') return; // géré par la vidéo elle-même

    slideTimerRef.current = setTimeout(goNext, imageDuration(current?.message));
    return () => clearTimeout(slideTimerRef.current);
  }, [currentIndex, slides, goNext]);

  // Appelé quand la vidéo active se termine (ou échoue) : avancer.
  const handleVideoEnded = useCallback(() => {
    goNext();
  }, [goNext]);

  // Rafraîchir les posts périodiquement
  useEffect(() => {
    if (!loading && !error) {
      refreshTimerRef.current = setInterval(() => {
        fetchPosts();
      }, FACEBOOK_CONFIG.REFRESH_INTERVAL);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [loading, error, fetchPosts]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, []);

  // Pendant le chargement des publications : on diffuse la vidéo de secours
  // (au lieu de l'écran de chargement) pour que l'affichage soit immédiat.
  if (loading) {
    return <DefaultVideo />;
  }

  // Erreur (API indisponible, aucun post, token invalide…) :
  // on diffuse la vidéo de secours au lieu d'un message d'erreur.
  if (error) {
    console.error('Erreur, bascule sur la vidéo par défaut:', error);
    return <DefaultVideo />;
  }

  const currentSlide = slides[currentIndex];
  const isVideoSlide = currentSlide?.type === 'video';

  return (
    <div className="app">
      <div className="slideshow">
        {/* Logo permanent (branding) affiché sur toutes les slides */}
        <img src={logo} className="brand-logo" alt="Ville de Settat" />

        {/* Horloge + météo (haut centre) */}
        <StatusBar />

        {/* Toutes les slides empilées : la slide active passe en opacité 1
            (fondu enchaîné) pendant que les autres restent masquées. */}
        {slides.map((slide, index) => (
          <Slide
            key={slide.id}
            post={slide}
            isActive={index === currentIndex}
            onEnded={handleVideoEnded}
          />
        ))}

        {/* Barre de progression (masquée pour les vidéos : durée variable) */}
        {!isVideoSlide && (
          <div className="slide-progress">
            <div
              className="slide-progress-fill"
              key={currentIndex}
              style={{ animationDuration: `${imageDuration(currentSlide?.message)}ms` }}
            />
          </div>
        )}

        {/* Indicateurs de position (points) */}
        <div className="slide-dots">
          {slides.map((slide, index) => (
            <span
              key={slide.id}
              className={`slide-dot ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Barre de bienvenue permanente */}
        <WelcomeBar />
      </div>
    </div>
  );
}
