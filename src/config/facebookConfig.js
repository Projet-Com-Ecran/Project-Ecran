// Configuration Facebook API
// Remplacez par vos propres credentials
export const FACEBOOK_CONFIG = {
  // Votre Token d'accès à longue durée
  // Obtenu depuis https://developers.facebook.com/apps/
  ACCESS_TOKEN: import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN || '',

  // ID de la Page Facebook
  // Format: numérique (ex: 123456789)
  PAGE_ID: import.meta.env.VITE_FACEBOOK_PAGE_ID || '',

  // Paramètres API
  API_VERSION: 'v23.0',

  // Configuration du polling
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes

  // Message de bienvenue affiché dans la barre du bas.
  WELCOME_TEXT: 'جماعة سطات ترحب بكم',

  // Durée d'affichage de chaque slide (style écran publicitaire).
  SLIDE_DURATION: 8000, // 8 s pour une image SANS texte

  // Posts AVEC texte : restent plus longtemps à l'écran (temps de lecture).
  TEXT_SLIDE_MIN: 18000, // durée minimale d'un post avec texte (18 s)
  TEXT_READING_PER_CHAR: 80, // ms ajoutées par caractère (vitesse de lecture)
  TEXT_SLIDE_MAX: 60000, // plafond (60 s), pour ne pas bloquer la rotation

  // Météo (Open-Meteo, gratuit et sans clé API).
  // Coordonnées de la ville de Settat par défaut.
  WEATHER: {
    LATITUDE: 33.001,
    LONGITUDE: -7.616,
    CITY: 'سطات',
    REFRESH: 10 * 60 * 1000, // rafraîchir la météo toutes les 10 min
  },

  // Résultats sportifs (TheSportsDB, clé de test gratuite '3').
  // Ligue 4429 = Coupe du Monde FIFA. Affichés dans le bandeau défilant.
  SPORTS: {
    API_KEY: '3',
    LEAGUE_ID: '4429',
    TITLE: 'Coupe du Monde 2026',
    REFRESH: 5 * 60 * 1000, // rafraîchir les scores toutes les 5 min
  },

  // Configuration des posts
  POSTS_LIMIT: 10, // Nombre de posts à récupérer

  // Bloc attachments : donne accès aux vidéos (media.source),
  // aux photos (media.image.src) et aux albums (subattachments).
  ATTACHMENTS: 'attachments{media_type,media,subattachments{media,media_type}}',

  // Champs complets (incluent les statistiques d'engagement).
  // Nécessite la permission 'pages_read_engagement'.
  FIELDS: ['id', 'message', 'story', 'created_time', 'permalink_url', 'full_picture', 'attachments{media_type,media,subattachments{media,media_type}}', 'shares', 'likes.limit(1).summary(true)', 'comments.limit(1).summary(true)'],

  // Champs de base (fonctionnent sans permission d'engagement).
  // Utilisés en repli si les statistiques ne sont pas accessibles.
  BASIC_FIELDS: ['id', 'message', 'story', 'created_time', 'permalink_url', 'full_picture', 'attachments{media_type,media,subattachments{media,media_type}}'],
};

// Validation de la configuration
export const validateConfig = () => {
  const { ACCESS_TOKEN, PAGE_ID } = FACEBOOK_CONFIG;

  if (!ACCESS_TOKEN) {
    console.warn('⚠️ ACCESS_TOKEN non configuré. Définissez VITE_FACEBOOK_ACCESS_TOKEN');
    return false;
  }

  if (!PAGE_ID) {
    console.warn('⚠️ PAGE_ID non configuré. Définissez VITE_FACEBOOK_PAGE_ID');
    return false;
  }

  return true;
};
