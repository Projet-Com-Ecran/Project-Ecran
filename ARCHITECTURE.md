# 🏗️ Architecture - Facebook TV Display

## 📐 Structure du Projet

```
facebook-tv-display/
│
├── src/                           # Code source React
│   ├── components/                # Composants React
│   │   ├── PostCard.jsx          # Affichage d'un post
│   │   ├── LoadingScreen.jsx     # État de chargement
│   │   └── ErrorScreen.jsx       # État d'erreur
│   │
│   ├── config/                    # Configuration
│   │   └── facebookConfig.js     # Config Facebook API
│   │
│   ├── services/                  # Logique métier
│   │   └── facebookService.js    # Service API Facebook
│   │
│   ├── styles/                    # Fichiers CSS
│   │   ├── PostCard.css
│   │   ├── LoadingScreen.css
│   │   └── ErrorScreen.css
│   │
│   ├── App.jsx                    # Composant principal
│   ├── App.css                    # Styles de l'app
│   ├── index.css                  # Styles globaux
│   ├── main.jsx                   # Point d'entrée React
│   └── index.html                 # HTML de base
│
├── dist/                          # Build produit (généré)
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css
│   │   └── index-*.js
│   └── (autres fichiers)
│
├── Configuration
│   ├── .env.example               # Template variables env
│   ├── .env.local                 # Variables locales (ignoré)
│   ├── .gitignore                 # Fichiers ignorés git
│   ├── package.json               # Dépendances npm
│   ├── vite.config.js             # Config Vite
│   └── index.html                 # HTML principal
│
└── Documentation
    ├── README.md                  # Documentation principale
    ├── SETUP.md                   # Guide de configuration
    ├── CREDENTIALS.md             # Obtenir les credentials
    ├── FEATURES.md                # Fonctionnalités
    ├── ARCHITECTURE.md            # Ce fichier
    └── start.bat/start.sh          # Scripts de démarrage
```

## 🔄 Flux de Données

```
App.jsx (State Management)
    │
    ├─── État: posts, currentPostIndex, loading, error
    ├─── Effets: Initialisation, timers, rafraîchissement
    └─── Rendu: PostCard, LoadingScreen, ErrorScreen
         │
         └─── Component -> Affichage utilisateur
              │
              └─── Interaction -> Changement d'index

FacebookService (API Integration)
    │
    ├─── createFacebookService()
    ├─── getPosts()                # Récupère posts Facebook
    ├─── getPageInfo()             # Info page (optionnel)
    └─── processPostsData()        # Traitement données
         │
         └─── Facebook Graph API
              │
              └─── Réponse JSON des posts
```

## 📦 Composants et Rôles

### 1. **App.jsx** (Orchestrateur Principal)

**Responsabilités:**
- Gestion de l'état global
- Orchestration des effets
- Gestion des timers
- Rendu conditionnel (loading/error/display)

**État Géré:**
```javascript
- posts: Post[]              // Liste des posts
- currentPostIndex: number   // Index du post affiché
- loading: boolean           // État de chargement
- error: string | null       // Message d'erreur
```

**Effets:**
- Initialisation du service Facebook
- Gestion du timer de rotation (30s)
- Rafraîchissement périodique (5 min)
- Cleanup des timers

### 2. **PostCard.jsx** (Composant d'Affichage)

**Responsabilités:**
- Affichage d'un post en grand
- Formatage des données
- Animations d'entrée

**Props:**
```javascript
{
  post: {
    id: string,
    message: string,
    createdTime: Date,
    permalink: string,
    image: string | null,
    likes: number,
    comments: number,
    shares: number,
  },
  isActive: boolean
}
```

### 3. **LoadingScreen.jsx** (État Intermédiaire)

**Responsabilités:**
- Affichage pendant le chargement
- Animation de spinner
- Messages informatifs

### 4. **ErrorScreen.jsx** (État d'Erreur)

**Responsabilités:**
- Affichage des erreurs
- Checklist de diagnostic
- Bouton réessai

## 🌐 Intégration Facebook

### Configuration

```javascript
// facebook-tv-display.js
FACEBOOK_CONFIG = {
  ACCESS_TOKEN: string,     // Token d'accès
  PAGE_ID: string,          // ID de la page
  API_VERSION: "v23.0",    // Version API
  REFRESH_INTERVAL: 5*60*1000,
  POSTS_LIMIT: 10,
  FIELDS: [...],           // Champs à récupérer
}
```

### Flux API

```
1. validateConfig()
   └─ Vérifier ACCESS_TOKEN et PAGE_ID

2. createFacebookService(token, pageId)
   └─ Instancier le service

3. getPosts()
   └─ Appel API: /PAGE_ID/posts
       │
       ├─ Paramètres: fields, limit, access_token
       │
       └─ Réponse: { data: [...] }
           │
           └─ processPostsData()
               └─ Filtrer et transformer

4. Retour: Post[]
```

### Endpoint API Utilisé

```http
GET https://graph.facebook.com/v23.0/{PAGE_ID}/posts
?fields=id,message,story,created_time,permalink_url,picture,full_picture,type,shares,likes.summary(true),comments.summary(true)
&access_token={TOKEN}
&limit={LIMIT}
```

## 🎨 Architecture CSS

### Hiérarchie des Styles

```
index.css (Global)
  ├─ Reset et normalisation
  ├─ Variables CSS
  ├─ Body et root
  └─ Styles de base

App.css (Layout TV)
  ├─ Grid layout
  ├─ Main post
  ├─ Carousel
  ├─ Footer
  └─ Responsive

PostCard.css (Composant)
  ├─ Card container
  ├─ Image
  ├─ Content
  ├─ Metadata
  ├─ Animations
  └─ Responsive

LoadingScreen.css
  ├─ Spinner
  ├─ Animations
  └─ Layout

ErrorScreen.css
  ├─ Container
  ├─ Messages
  ├─ Buttons
  └─ Animations
```

### Breakpoints Responsifs

```css
Desktop 4K:     2560px+
Desktop Full:   1920px+
Desktop HD:     1280px+
Tablet:         < 1280px
Mobile:         < 768px
```

## ⏱️ Gestion du Timing

### Timers et Intervals

```javascript
postTimerRef
  ├─ Type: setTimeout
  ├─ Durée: 30000 ms
  ├─ Action: Changer le post
  └─ Cleanup: Avant chaque nouveau timeout

refreshTimerRef
  ├─ Type: setInterval
  ├─ Durée: 5 * 60 * 1000 ms
  ├─ Action: Appeler fetchPosts()
  └─ Cleanup: À la dépendance
```

### Lifecycle des Timers

```
Chargement
    ↓
Timers initialisés
    ├─ postTimer (rotation)
    └─ refreshTimer (rafraîchissement)
    ↓
En cas d'erreur
    ├─ postTimer cleared
    └─ refreshTimer cleared
    ↓
Avant unmount
    └─ Tous les timers cleared
```

## 🔒 Gestion de la Configuration

### Ordre de Priorité

```
1. Fichier .env.local (environnement local)
2. Fichier .env (variables par défaut)
3. import.meta.env (variables Vite)
4. Valeurs par défaut dans config
5. Erreur si requise et absent
```

### Variables d'Environnement

```
VITE_FACEBOOK_ACCESS_TOKEN
  └─ Source: .env.local
  └─ Validation: Non vide
  └─ Sécurité: Ne jamais commiter

VITE_FACEBOOK_PAGE_ID
  └─ Source: .env.local
  └─ Validation: Numérique
  └─ Format: string (123456789)
```

## 🚀 Build et Deployment

### Process de Build

```
npm run build
    ├─ Vite compile React
    ├─ Minification du JS/CSS
    ├─ Tree-shaking des dépendances
    ├─ Génération source maps
    └─ Output: dist/
        ├─ index.html (1.24 KB)
        ├─ assets/index-*.css (7.62 KB)
        └─ assets/index-*.js (199 KB)
```

### Artefacts de Build

```
dist/
├─ index.html              # Point d'entrée principal
├─ assets/
│  ├─ index-BSRcHgzZ.css  # CSS bundlé
│  └─ index-DGF0wXi0.js   # JS bundlé + React
└─ (aucun asset statique par défaut)
```

## 🔐 Sécurité

### Mesures Implémentées

1. **Credentials**
   - Stockage local uniquement (.env.local)
   - Jamais d'exposition en production
   - Fichier .gitignore préconfiguré

2. **API**
   - HTTPS obligatoire (Facebook Graph)
   - Permissions minimales
   - Validation des réponses

3. **XSS Prevention**
   - Utilisation de React (escaping auto)
   - Pas de innerHTML
   - Sanitization du contenu utilisateur

## 📊 State Management

### Approche

**No Redux/Context/Zustand** - Utilise React Hooks natifs:
- `useState` pour l'état local
- `useEffect` pour les effets
- `useRef` pour les timers
- `useCallback` pour les fonctions stables

### Raison

- Application simple avec peu d'état
- Pas de prop drilling profond
- Performance suffisante
- Moins de dépendances

## 🧪 Points d'Extension Futur

### Possibles Améliorations

1. **Filtrage**
   - Par type de post
   - Par date
   - Par engagement

2. **Personnalisation**
   - Thème personnalisé
   - Branding

3. **Multi-Page**
   - Rotation entre pages
   - Affichage de plusieurs pages

4. **Analytics**
   - Tracking des impressions
   - Logs

5. **Admin Dashboard**
   - Interface de configuration
   - Gestion des posts
   - Statistiques

## 🎯 Principes de Design

### Utilisés

1. **Single Responsibility**
   - Chaque composant a un seul rôle
   - Service séparé de la UI

2. **Composability**
   - Petits composants réutilisables
   - Facile à tester

3. **DRY (Don't Repeat Yourself)**
   - Pas de duplication de code
   - Logique centralisée

4. **KISS (Keep It Simple Stupid)**
   - Pas sur-engineered
   - Juste assez de complexité

---

**Architecture claire, maintenable et scalable!** ✨
