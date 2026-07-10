# Facebook TV Display 📺

Une application React moderne qui transforme les publications d'une Page Facebook en affichage dynamique plein écran pour une télévision. Parfait pour les Digital Signage, événements et espaces publics.

## 🎯 Objectif

Créer un écran Digital Signage qui affiche automatiquement les posts Facebook d'une Page sans intervention utilisateur. L'application boucle à travers les publications avec des transitions fluides et affiche des statistiques d'engagement en temps réel.

## 🛠️ Technologies

- **React** - Framework UI moderne
- **Vite** - Bundler ultra-rapide
- **JavaScript (ES6+)** - Logique applicative
- **CSS 3** - Styles purs (pas de frameworks CSS)
- **Facebook Graph API v23.0** - Accès aux données Facebook
- **Frontend Only** - Pas de backend requis

## 📋 Prérequis

- Node.js >= 16
- npm ou yarn
- Une Page Facebook
- Un Access Token Facebook valide

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet:

```bash
cp .env.example .env.local
```

Remplissez les variables:

```env
VITE_FACEBOOK_ACCESS_TOKEN=your_token_here
VITE_FACEBOOK_PAGE_ID=your_page_id_here
```

## 🔐 Obtenir les Credentials Facebook

### Étape 1: Créer une App Facebook

1. Allez sur [Facebook Developers](https://developers.facebook.com)
2. Cliquez sur "My Apps" → "Create App"
3. Choisissez "Consumer" comme type d'app
4. Remplissez les informations

### Étape 2: Obtenir l'Access Token

1. Dans votre app, allez à "Tools" → "Graph API Explorer"
2. Sélectionnez votre Page Facebook dans le dropdown
3. Générez un Token avec les permissions:
   - `pages_read_engagement`
   - `pages_read_user_content`
4. Cliquez sur "Generate Access Token"
5. Copiez le token dans votre `.env.local`

### Étape 3: Obtenir l'ID de la Page

1. Allez sur votre Page Facebook
2. Cliquez sur "À propos"
3. L'ID de la page est affiché dans les détails

## 💻 Démarrage

### Mode Développement

```bash
npm run dev
```

L'app s'ouvrira sur `http://localhost:5173`

### Mode Production

```bash
npm run build
npm run preview
```

## 📱 Utilisation

### Affichage en Plein Écran

1. Lancez l'application
2. Pressez `F11` pour passer en mode plein écran (navigateur)
3. Les posts s'affichent automatiquement, changement tous les 30 secondes
4. Cliquez sur les miniatures à droite pour changer manuellement de post
5. Les données se rafraîchissent automatiquement toutes les 5 minutes

### Interface

**Écran Principal:**
- Image et contenu du post en grand
- Titre, message et date
- Statistiques: likes, commentaires, partages
- Barre de progression (30 secondes)

**Carrousel Latéral:**
- Aperçu des prochains posts
- Miniature avec image ou numéro
- Clic pour sélectionner directement

**Pied de Page:**
- Compteur: "Post X / Y"
- Indicateur "Lecture automatique"

## ⚙️ Configuration Avancée

Modifiez les constantes dans `src/config/facebookConfig.js`:

```javascript
POSTS_LIMIT: 10,              // Nombre de posts
REFRESH_INTERVAL: 5 * 60 * 1000, // Rafraîchissement (5 min)
```

Modifiez la durée d'affichage dans `src/App.jsx` (recherchez `30000`).

## 🎨 Personnalisation

### Couleurs et Gradients

Modifiez les fichiers CSS dans `src/styles/`

### Animations

Ajustez les durées dans les fichiers CSS

## 🐛 Troubleshooting

### "Configuration manquante"

Vérifiez que `.env.local` existe et que les variables sont définies.

### "Erreur Facebook API"

Générez un nouveau token depuis [Graph API Explorer](https://developers.facebook.com/tools/explorer)

### Aucun post ne s'affiche

Vérifiez l'ID de la page et que la page a des posts publics.

## 📊 Architecture

```
src/
├── components/        # Composants React
├── config/           # Configuration
├── services/         # Services API
├── styles/           # Fichiers CSS
├── App.jsx           # Composant principal
└── index.css         # Styles globaux
```

## 📈 Cas d'Usage

- 🏢 Affichage en lobby d'entreprise
- 🎬 Événements et conférences
- 🛍️ Point de vente et retail
- 🎉 Événements spéciaux
- 📍 Espaces publics

## 💡 Tips

### Affichage sur Raspberry Pi

```bash
chromium-browser --kiosk http://localhost:5173
```

### Rafraîchissement Automatique

Les données se mettent à jour automatiquement. L'intervalle peut être modifié dans `facebookConfig.js`.

---

**Créé avec ❤️ pour les Digital Signage**
