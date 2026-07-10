# 🔧 Guide de Dépannage - Facebook TV Display

## 📊 Table des Problèmes

1. [Erreurs de Configuration](#erreurs-de-configuration)
2. [Erreurs Facebook API](#erreurs-facebook-api)
3. [Problèmes de Chargement](#problèmes-de-chargement)
4. [Problèmes d'Affichage](#problèmes-daffichage)
5. [Erreurs de Performance](#erreurs-de-performance)
6. [Problèmes de Déploiement](#problèmes-de-déploiement)

---

## Erreurs de Configuration

### ❌ "Cannot find variable: VITE_FACEBOOK_ACCESS_TOKEN"

**Symptômes:**
- Application charge mais affiche l'écran d'erreur
- Console affiche: `Cannot find variable`

**Causes Possibles:**
1. Fichier `.env.local` n'existe pas
2. Variables non définies dans `.env.local`
3. Serveur dev non redémarré après modification

**Solutions:**
```bash
# 1. Créer le fichier
cp .env.example .env.local

# 2. Vérifier le contenu
cat .env.local

# 3. Redémarrer le serveur
# Ctrl+C pour arrêter
npm run dev

# 4. Forcer le rechargement du navigateur
# Ctrl+Shift+R (hard refresh)
```

**Vérification:**
```bash
# Windows - Vérifier que le fichier existe
dir .env.local

# macOS/Linux - Vérifier que le fichier existe
ls -la .env.local
```

---

### ❌ "VITE_FACEBOOK_PAGE_ID is not a valid number"

**Symptômes:**
- Écran d'erreur s'affiche
- "Configuration manquante" ou erreur API

**Causes:**
- L'ID n'est pas numérique
- Guillemets dans la valeur
- Espaces avant/après la valeur

**Solution:**
```env
# ❌ MAUVAIS
VITE_FACEBOOK_PAGE_ID="123456789"
VITE_FACEBOOK_PAGE_ID=123456789 

# ✅ BON
VITE_FACEBOOK_PAGE_ID=123456789
```

---

### ❌ npm: command not found

**Symptômes:**
- Terminal affiche: `npm: command not found`
- Impossible de lancer l'app

**Causes:**
- Node.js n'est pas installé
- NODE pas dans le PATH

**Solution:**
```bash
# Vérifier Node.js
node -v
npm -v

# Si pas trouvé, installer
# Visitez: https://nodejs.org
# Téléchargez LTS (version longue terme)
# Installez avec les options par défaut

# Après installation, redémarrez le terminal
# et vérifiez:
node -v
npm -v
```

---

## Erreurs Facebook API

### ❌ "The access token is invalid"

**Symptômes:**
- Écran d'erreur
- Message: "Facebook API Error: The access token is invalid"

**Causes:**
1. Token expiré
2. Token mal copié
3. Espaces avant/après le token
4. Caractères invisibles dans le token

**Solutions:**

**Solution 1: Générer un nouveau token**
```
1. Allez sur https://developers.facebook.com/tools/explorer
2. Sélectionnez votre app (dropdown gauche)
3. Sélectionnez votre Page (dropdown central)
4. Cliquez "Generate Access Token"
5. Copiez le nouveau token
6. Remplacez dans .env.local
7. Redémarrez l'app
```

**Solution 2: Convertir en token long terme**
```
1. Le token généré dure 2 heures
2. Convertissez-le en token long terme (60 jours):
   - https://token.developit.app/
   - Ou via GraphQL manuel
3. Utilisez ce token long terme
```

**Solution 3: Vérifier pour les espaces**
```bash
# Vérifiez qu'il n'y a pas d'espaces
# Dans .env.local, la ligne doit être:
VITE_FACEBOOK_ACCESS_TOKEN=EAABbKmJ7Z8kBAOZ...

# Pas d'espace après le token:
VITE_FACEBOOK_ACCESS_TOKEN=EAABbKmJ7Z8kBAOZ... 
#                                              ^ Pas d'espace ici!
```

---

### ❌ "Access Denied"

**Symptômes:**
- Message d'erreur: "Access Denied"
- Impossible de lire les posts

**Causes:**
1. Permissions insuffisantes
2. Pas admin de la page
3. Token révoqué

**Solutions:**

**Solution 1: Ajouter les permissions**
```
1. Allez sur https://developers.facebook.com
2. Allez dans votre app
3. Allez dans Paramètres → Basique
4. Cherchez "Permissions"
5. Demandez l'accès à:
   - pages_read_engagement
   - pages_read_user_content
6. Régénérez le token
```

**Solution 2: Devenir Admin de la Page**
```
1. Allez sur votre page Facebook
2. Allez dans Paramètres → Administrateurs
3. Ajoutez votre compte si absent
```

**Solution 3: Révoquer et Recréer**
```
1. Allez dans Paramètres → Sécurité
2. Révoquez tous les tokens
3. Régénérez un nouveau token
```

---

### ❌ "Page does not exist"

**Symptômes:**
- Message: "Page does not exist" ou "Unknown"
- Erreur 400 de l'API

**Causes:**
1. ID de page incorrect
2. Page supprimée
3. Pas d'accès à la page

**Solutions:**

**Solution 1: Vérifier l'ID**
```
1. Allez sur votre page Facebook
2. Cliquez sur "À propos"
3. Cherchez "Page ID" ou "Numéro de page"
4. Copiez cet ID
5. Remplacez dans .env.local
```

**Solution 2: Utiliser un outil de lookup**
```
1. Visitez: https://findmyfbid.com/
2. Entrez l'URL: facebook.com/votre-page
3. Cliquez "Search"
4. Copiez l'ID
```

**Solution 3: Vérifier l'accès**
```
- Vous devez être administrateur de la page
- Ou au minimum avoir accès en lecture
```

---

### ❌ "No permission to access"

**Symptômes:**
- Message: "This person does not have permission..."
- Impossible d'accéder à la page

**Causes:**
- Vous n'êtes pas admin de la page
- Compte personnel sans accès

**Solution:**
```
1. Demandez l'accès admin à la page
2. Le propriétaire peut vous ajouter dans:
   Paramètres → Administrateurs → Ajouter un administrateur
```

---

## Problèmes de Chargement

### ❌ Application charges indéfiniment

**Symptômes:**
- Spinner de chargement ne disparaît pas
- Aucune erreur affichée

**Causes:**
1. Appel API bloqué/lent
2. Page sans posts publics
3. Problème réseau

**Solutions:**

**Solution 1: Vérifier la console**
```bash
# Ouvrez F12 → Console
# Cherchez les erreurs rouges
# Copiez le message d'erreur
```

**Solution 2: Vérifier que la page a des posts**
```
1. Allez sur votre page Facebook
2. Vérifiez qu'il y a au moins 1 post public
3. Les posts doivent avoir du texte ou une image
```

**Solution 3: Tester l'API manuellement**
```bash
# Remplacez TOKEN et PAGE_ID
# Testez dans le navigateur:
https://graph.facebook.com/PAGE_ID?access_token=TOKEN

# Vous devriez voir les infos JSON de la page
```

**Solution 4: Augmenter le timeout**
```javascript
// Dans src/App.jsx, ligne ~30
// Augmentez le délai avant timeout (actuellement pas de timeout)
// Ou ajoutez un timeout manuel
```

---

### ❌ Erreur CORS (Cross-Origin)

**Symptômes:**
- Console affiche: "CORS error"
- "blocked by CORS policy"

**Causes:**
- Rarement, Facebook peut bloquer
- Problème de domaine configuré

**Solutions:**
```
1. Allez dans votre app Facebook
2. Paramètres → Basique
3. Cherchez "App Domains"
4. Ajoutez votre domaine:
   - localhost (pour dev local)
   - votre-domaine.com (pour production)
```

---

## Problèmes d'Affichage

### ❌ Aucun post ne s'affiche

**Symptômes:**
- Pas d'erreur
- Écran noir ou blanc
- Loading disparaît mais rien n'apparaît

**Causes:**
1. La page n'a pas de posts publics
2. Les posts ne ont pas de contenu textuel/image
3. Filtres trop restrictifs

**Solutions:**

**Solution 1: Ajouter des posts**
```
1. Allez sur votre page
2. Créez un nouveau post public
3. Ajoutez du texte et/ou une image
4. Attendez 1-2 secondes
5. L'app devrait rafraîchir
```

**Solution 2: Vérifier l'API**
```bash
# Remplacez TOKEN et PAGE_ID
https://graph.facebook.com/PAGE_ID/posts?access_token=TOKEN

# Vous devriez voir un JSON avec des posts
# Si la liste est vide: []
# Alors la page n'a pas de posts
```

**Solution 3: Augmenter la limite**
```javascript
// Dans src/config/facebookConfig.js
POSTS_LIMIT: 50, // Augmentez de 10 à 50
```

---

### ❌ Images qui ne se chargent pas

**Symptômes:**
- Les textes s'affichent, pas les images
- Espace blanc où devrait être l'image

**Causes:**
1. Accès limité aux images
2. Post sans image
3. Problème de permissions

**Solutions:**

**Solution 1: Ajouter les permissions**
```javascript
// Dans src/config/facebookConfig.js
FIELDS: [..., 'picture', 'full_picture'], // Vérifiez que c'est là
```

**Solution 2: Vérifier les posts**
```
1. Assurez-vous que vos posts ont des images
2. Les images doivent être publiques
3. Pas d'images privées ou avec restrictions
```

---

### ❌ Texte illisible / trop petit

**Symptômes:**
- Texte trop petit à distance
- Statistiques invisibles

**Causes:**
- Résolution d'écran très grande
- Styles CSS mal ajustés

**Solutions:**

**Solution 1: Ajuster la taille du texte**
```css
/* Dans src/styles/PostCard.css */
.post-message {
  font-size: 2.5rem;  /* Augmentez cette valeur */
  /* Essayez 3rem, 4rem, etc. */
}
```

**Solution 2: Ajuster zoom du navigateur**
```
Ctrl++ (plusieurs fois)
Ou
Navigateur → Paramètres → Zoom
```

**Solution 3: Utiliser le responsive**
```css
/* Le CSS a déjà des media queries */
@media (max-width: 2560px) {
  /* Styles pour 4K */
}
```

---

## Erreurs de Performance

### ❌ Application très lente

**Symptômes:**
- Transitions figées
- Changement de post lent
- Interface non-réactive

**Causes:**
1. Trop de posts (limite 10-50)
2. Images très grandes
3. Animations trop complexes

**Solutions:**

**Solution 1: Réduire le nombre de posts**
```javascript
// src/config/facebookConfig.js
POSTS_LIMIT: 5, // Au lieu de 10
```

**Solution 2: Optimiser les images**
```javascript
// Facebook devrait déjà les optimiser
// Mais vérifiez que full_picture est utilisé (pas de grande image)
```

**Solution 3: Désactiver certaines animations**
```css
/* Dans src/styles/PostCard.css */
.post-card {
  animation: none; /* Désactiver l'animation */
}
```

---

### ❌ Consommation mémoire élevée

**Symptômes:**
- L'app ralentit au fil du temps
- Les onglets du navigateur deviennent lents

**Causes:**
1. Fuite mémoire des timers
2. Cache de React non optimisé
3. Accumulation d'objets

**Solutions:**

**Solution 1: Redémarrer l'app**
```bash
Ctrl+C # Arrêter le serveur
npm run dev # Relancer
```

**Solution 2: Vérifier les timers**
```javascript
// Dans src/App.jsx
// Les timers doivent avoir un cleanup
// Vérifiez que clearTimeout/clearInterval sont appelés
```

**Solution 3: Réduire le rafraîchissement**
```javascript
// src/config/facebookConfig.js
REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes au lieu de 5
```

---

## Problèmes de Déploiement

### ❌ "npm: command not found" lors du build

**Symptômes:**
- Erreur au déploiement
- "npm not found"

**Causes:**
- Node.js pas installé sur le serveur
- Mauvais PATH

**Solution:**
```bash
# Sur le serveur, installer Node.js
# Ubuntu/Debian:
sudo apt update
sudo apt install nodejs npm

# Vérifier:
node -v
npm -v
```

---

### ❌ "Cannot find module 'vite'"

**Symptômes:**
- Erreur lors du build
- "Cannot find module"

**Cause:**
- Dépendances pas installées

**Solution:**
```bash
npm install
npm run build
```

---

### ❌ "dist/ folder is empty"

**Symptômes:**
- Après build, le dossier dist/ est vide
- Ou contient peu de fichiers

**Causes:**
- Build échoué
- Erreur JS non visible

**Solutions:**

**Solution 1: Vérifier les erreurs**
```bash
npm run build 2>&1 | tail -50
```

**Solution 2: Vérifier les fichiers**
```bash
# Devrait avoir:
# - index.html
# - assets/
#   - index-*.css
#   - index-*.js
ls -la dist/
```

---

### ❌ "Port 5173 already in use"

**Symptômes:**
- Erreur: "Port 5173 is already in use"
- "EADDRINUSE"

**Causes:**
- Un autre processus utilise le port
- Ancien serveur pas fermé

**Solutions:**

**Solution 1: Utiliser un autre port**
```bash
npm run dev -- --port 3000
```

**Solution 2: Tuer le processus**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

---

### ❌ Page blanche en production

**Symptômes:**
- Déployé sur serveur
- Page complètement blanche
- Pas de contenu

**Causes:**
1. Variables d'environnement non définies
2. Erreur JS non visible
3. Asset paths incorrects

**Solutions:**

**Solution 1: Ouvrir la console**
```
F12 → Console → Chercher erreurs rouges
```

**Solution 2: Vérifier les variables**
```bash
# Sur le serveur de production
# Vérifier que les variables d'env sont définies
echo $VITE_FACEBOOK_ACCESS_TOKEN
echo $VITE_FACEBOOK_PAGE_ID
```

**Solution 3: Vérifier les assets**
```
F12 → Network
Chercher les erreurs 404 (assets manquants)
```

---

## 🆘 Demander de l'Aide

### Informations à Fournir

Quand vous demandez de l'aide, fournissez:

1. **Message d'erreur complet**
   ```
   Copier-coller exactement l'erreur
   ```

2. **Console du navigateur**
   ```
   F12 → Console → Screenshot ou texte
   ```

3. **Version de Node/npm**
   ```bash
   node -v
   npm -v
   ```

4. **Système d'exploitation**
   ```
   Windows 10 / macOS Ventura / Ubuntu 22.04
   ```

5. **Étapes pour reproduire**
   ```
   1. J'ai fait...
   2. Puis...
   3. Alors... l'erreur apparaît
   ```

### Ressources Utiles

- 📖 [Documentation Facebook API](https://developers.facebook.com/docs/graph-api)
- 🛠️ [Graph API Explorer](https://developers.facebook.com/tools/explorer)
- 🐛 [Debuggeur Facebook](https://developers.facebook.com/tools/debug)
- 💬 [Comunité Facebook Developers](https://developers.facebook.com/community)

---

**Bon dépannage! 🎯**
