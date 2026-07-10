# Guide de Configuration - Facebook TV Display

## 📝 Étapes Rapides

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration Facebook

#### a) Créer une App Facebook
1. Visitez https://developers.facebook.com
2. Cliquez sur **"My Apps"** en haut à droite
3. Cliquez sur **"Create App"**
4. Sélectionnez **"Consumer"** comme type
5. Remplissez le formulaire avec les informations de votre entreprise
6. Acceptez les conditions et cliquez **"Create App"**

#### b) Obtenir le Token d'Accès
1. Dans votre app, allez à **"Tools & Support"** → **"Graph API Explorer"**
2. En haut du formulaire, changez l'utilisateur sélectionné vers votre **Page Facebook**
3. Cliquez sur **"Generate Access Token"**
4. Accordez les permissions demandées
5. Copiez le token généré (c'est une longue chaîne)

#### c) Obtenir l'ID de la Page
**Méthode 1 (Recommandée):**
1. Allez sur votre Page Facebook
2. Cliquez sur **"À propos"** dans le menu gauche
3. Scrollez vers le bas jusqu'à trouver **"ID de la page"**
4. Copiez ce numéro

**Méthode 2 (Alternative):**
1. Allez sur https://lookup-id.com/
2. Entrez l'URL de votre page (ex: facebook.com/ma-page)
3. Cliquez sur **"Search"**
4. Copiez l'ID affiché

### 3. Créer le fichier `.env.local`

À la racine du projet (même dossier que `package.json`):

```bash
# Windows
copy .env.example .env.local

# macOS/Linux
cp .env.example .env.local
```

Ouvrez `.env.local` et remplissez:
```env
VITE_FACEBOOK_ACCESS_TOKEN=votre_token_ici
VITE_FACEBOOK_PAGE_ID=votre_id_page_ici
```

Exemple complété:
```env
VITE_FACEBOOK_ACCESS_TOKEN=EAABbKmJ7Z8kBAOZC3bJ7bKmJ7Z8kBAOZ...
VITE_FACEBOOK_PAGE_ID=123456789
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrez votre navigateur sur **http://localhost:5173**

### 5. Test en Plein Écran

- Pressez **F11** pour activer le mode plein écran
- Ou cliquez sur les 3 points du navigateur → **"Mode plein écran"**

## ✅ Checklist de Configuration

- [ ] Node.js v16+ installé (`node -v`)
- [ ] Dépendances installées (`npm install`)
- [ ] App Facebook créée
- [ ] Token d'accès généré
- [ ] ID de page obtenu
- [ ] Fichier `.env.local` créé
- [ ] Variables d'environnement remplies
- [ ] Serveur lancé (`npm run dev`)
- [ ] Application accessible sur localhost:5173

## 🔑 Permissions Requises

Votre token Facebook doit avoir ces permissions:
- ✅ `pages_read_engagement` - Lire les statistiques des posts
- ✅ `pages_read_user_content` - Lire le contenu des posts

Si vous avez une erreur de permissions:
1. Retournez à Graph API Explorer
2. Cliquez sur le token en haut
3. Cliquez sur **"Edit Permissions"**
4. Ajoutez les permissions manquantes
5. Générez un nouveau token

## 🐛 Problèmes Courants

### "Cannot find variable: VITE_FACEBOOK_ACCESS_TOKEN"
**Solution:**
- Vérifiez que `.env.local` existe
- Redémarrez le serveur dev (`Ctrl+C` puis `npm run dev`)

### "Invalid request: Missing fields"
**Solution:**
- Vérifiez l'ID de la page (doit être numérique)
- Assurez-vous que vous avez accès à la page

### "Aucun post ne s'affiche"
**Solution:**
- La page doit avoir au moins un post public
- Le token peut être expiré (générez-en un nouveau)
- Vérifiez les permissions

### L'application charge mais rien n'apparaît
**Solution:**
1. Ouvrez la console (F12)
2. Vérifiez les erreurs rouges
3. Communiquez l'erreur pour le support

## 🚀 Déploiement

### Mode Production
```bash
npm run build
```

Cela génère un dossier `dist/` prêt pour déploiement.

### Sur un Serveur
```bash
npm run build
# Uploadez le contenu de `dist/` sur votre serveur
```

### Sur Vercel (Recommandé)
```bash
# Installez Vercel
npm i -g vercel

# Déployez
vercel
```

Suivez les instructions pour déployer automatiquement.

### Utiliser en Plein Écran sur Kiosk

**Windows:**
```batch
start chrome --kiosk http://votre-url.vercel.app
```

**macOS:**
```bash
open -a "Google Chrome" --args --kiosk http://votre-url.vercel.app
```

**Linux/Raspberry Pi:**
```bash
chromium-browser --kiosk http://votre-url.vercel.app
```

## 📊 Structure du Projet

```
facebook-tv-display/
├── src/
│   ├── components/           # Composants React
│   │   ├── PostCard.jsx
│   │   ├── LoadingScreen.jsx
│   │   └── ErrorScreen.jsx
│   ├── config/
│   │   └── facebookConfig.js
│   ├── services/
│   │   └── facebookService.js
│   ├── styles/
│   │   ├── PostCard.css
│   │   ├── LoadingScreen.css
│   │   └── ErrorScreen.css
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── .env.example              # Template des variables
├── .env.local                # Configuration locale (ne pas commiter)
├── package.json
└── README.md
```

## 🔄 Configuration Personnalisée

### Changer la Durée d'Affichage d'un Post

Dans `src/App.jsx`, trouvez cette ligne (autour de la ligne 60):
```javascript
postTimerRef.current = setTimeout(() => {
  setCurrentPostIndex((prev) => (prev + 1) % posts.length);
}, 30000); // ← Changez cette valeur (en millisecondes)
```

Exemples:
- 15 secondes: `15000`
- 30 secondes: `30000`
- 1 minute: `60000`
- 2 minutes: `120000`

### Changer l'Intervalle de Rafraîchissement

Dans `src/config/facebookConfig.js`:
```javascript
REFRESH_INTERVAL: 5 * 60 * 1000, // ← Modifier ici (actuellement 5 minutes)
```

Exemples:
- 1 minute: `1 * 60 * 1000`
- 5 minutes: `5 * 60 * 1000` (défaut)
- 10 minutes: `10 * 60 * 1000`
- 30 minutes: `30 * 60 * 1000`

### Changer le Nombre de Posts Affichés

Dans `src/config/facebookConfig.js`:
```javascript
POSTS_LIMIT: 10, // ← Modifier ici
```

## 📞 Support

- 📖 [Documentation Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- 🛠️ [Outils Développeur Facebook](https://developers.facebook.com/tools)
- 💬 [Forum des Développeurs Facebook](https://developers.facebook.com/community)

---

**Vous êtes maintenant prêt à lancer l'application! 🚀**
