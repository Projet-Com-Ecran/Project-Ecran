import { FACEBOOK_CONFIG } from '../config/facebookConfig';

export class FacebookService {
  constructor(accessToken, pageId) {
    this.userToken = accessToken;
    this.pageId = pageId;
    this.pageToken = null; // Token de Page récupéré automatiquement
    this.apiVersion = FACEBOOK_CONFIG.API_VERSION;
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Récupère le Page Access Token à partir du token utilisateur.
   * La nouvelle version de l'API Pages exige un token de Page (et non
   * un token utilisateur) pour lire les publications d'une Page.
   * On échange donc automatiquement le token utilisateur contre le
   * token de la Page ciblée.
   */
  async ensurePageToken() {
    if (this.pageToken) return this.pageToken;

    const url = `${this.baseUrl}/${this.pageId}`;
    const params = new URLSearchParams({
      fields: 'access_token',
      access_token: this.userToken,
    });

    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    if (data.access_token) {
      this.pageToken = data.access_token;
    } else {
      // Le token fourni est peut-être déjà un token de Page :
      // on l'utilise tel quel en dernier recours.
      this.pageToken = this.userToken;
    }

    return this.pageToken;
  }

  /**
   * Appelle l'endpoint /posts avec un ensemble de champs donné.
   * Retourne la réponse JSON (data ou error) sans lever d'exception
   * afin de permettre un mécanisme de repli.
   */
  async fetchPostsWithFields(pageToken, fields) {
    const url = `${this.baseUrl}/${this.pageId}/posts`;
    const params = new URLSearchParams({
      fields: fields.join(','),
      access_token: pageToken,
      limit: FACEBOOK_CONFIG.POSTS_LIMIT,
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    return response.json();
  }

  async getPosts() {
    try {
      const pageToken = await this.ensurePageToken();

      // 1. Tentative avec les champs complets (statistiques incluses).
      let data = await this.fetchPostsWithFields(pageToken, FACEBOOK_CONFIG.FIELDS);

      // 2. Repli sur les champs de base si la permission d'engagement
      //    manque (code 10) ou qu'un champ est déprécié (code 12).
      if (data.error) {
        const code = data.error.code;
        if (code === 10 || code === 12 || code === 100) {
          console.warn(
            "Statistiques d'engagement indisponibles (permission 'pages_read_engagement' manquante). " +
            'Affichage sans les compteurs likes/commentaires.'
          );
          data = await this.fetchPostsWithFields(pageToken, FACEBOOK_CONFIG.BASIC_FIELDS);
        }
      }

      if (data.error) {
        throw new Error(`Facebook API Error: ${data.error.message}`);
      }

      return this.processPostsData(data.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      throw error;
    }
  }

  /**
   * Extrait la liste des médias d'un post à partir de ses attachments.
   * Gère : vidéos (media.source), photos (media.image.src) et
   * albums à plusieurs images (subattachments).
   * Retourne un tableau [{ type: 'video'|'image', url, poster }].
   */
  extractMedia(post) {
    const medias = [];
    const attachment = post.attachments?.data?.[0];

    // Album : plusieurs sous-éléments (photos et/ou vidéos).
    const subs = attachment?.subattachments?.data;
    if (subs && subs.length > 0) {
      subs.forEach((sub) => {
        const isVideo = sub.media_type === 'video' || !!sub.media?.source;
        const image = sub.media?.image?.src;
        if (isVideo && sub.media?.source) {
          medias.push({ type: 'video', url: sub.media.source, poster: image || null });
        } else if (image) {
          medias.push({ type: 'image', url: image });
        }
      });
      if (medias.length > 0) return medias;
    }

    // Attachment unique.
    if (attachment) {
      const isVideo = attachment.media_type === 'video' || !!attachment.media?.source;
      const image = attachment.media?.image?.src || post.full_picture;
      if (isVideo && attachment.media?.source) {
        medias.push({ type: 'video', url: attachment.media.source, poster: image || null });
        return medias;
      }
      if (image) {
        medias.push({ type: 'image', url: image });
        return medias;
      }
    }

    // Repli : image principale du post.
    if (post.full_picture || post.picture) {
      medias.push({ type: 'image', url: post.full_picture || post.picture });
    }
    return medias;
  }

  /**
   * Convertit les posts en slides.
   * Un post album à 3 images = 1 slide avec 3 images affichées simultanément.
   * Une vidéo = 1 slide vidéo.
   * Chaque slide porte le texte/date/stats de son post d'origine.
   */
  processPostsData(posts) {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.created_time) - new Date(a.created_time)
    );

    const slides = [];
    sorted.forEach((post) => {
      const medias = this.extractMedia(post);
      if (medias.length === 0 && !(post.message || post.story)) return;

      const base = {
        postId: post.id,
        message: post.message || post.story || '',
        createdTime: new Date(post.created_time),
        permalink: post.permalink_url,
        shares: post.shares?.count ?? null,
        likes: post.likes?.summary?.total_count ?? null,
        comments: post.comments?.summary?.total_count ?? null,
      };

      if (medias.length === 0) {
        // Post texte seul.
        slides.push({ ...base, id: post.id, type: 'text', url: null });
        return;
      }

      // Une seule slide avec tous les médias (images d'un album affichées ensemble)
      const hasVideo = medias.some(m => m.type === 'video');
      slides.push({
        ...base,
        id: post.id,
        type: hasVideo ? 'video' : 'image',
        url: medias[0].url,
        poster: medias[0].poster || null,
        medias: medias, // Tableau de tous les médias à afficher ensemble
      });
    });

    return slides;
  }

  async getPageInfo() {
    try {
      const pageToken = await this.ensurePageToken();

      const url = `${this.baseUrl}/${this.pageId}`;
      const params = new URLSearchParams({
        fields: 'name,picture,description',
        access_token: pageToken,
      });

      const response = await fetch(`${url}?${params}`);

      if (!response.ok) {
        throw new Error(`Erreur récupération info page: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des infos de la page:', error);
      throw error;
    }
  }
}

export const createFacebookService = () => {
  const { ACCESS_TOKEN, PAGE_ID } = FACEBOOK_CONFIG;
  return new FacebookService(ACCESS_TOKEN, PAGE_ID);
};
