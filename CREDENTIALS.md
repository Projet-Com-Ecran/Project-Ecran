# 🔐 Guide d'Obtention des Credentials Facebook

## Ce document vous aide à obtenir les tokens et IDs nécessaires

### Pour commencer

Vous avez besoin de deux choses:
1. **VITE_FACEBOOK_ACCESS_TOKEN** - Un token d'accès à longue durée
2. **VITE_FACEBOOK_PAGE_ID** - L'ID numérique de votre Page Facebook

---

## 📋 Étape 1: Créer une App Facebook

### Si vous n'avez pas encore d'app:

1. Allez sur **https://developers.facebook.com**
2. Cliquez sur **"My Apps"** (en haut à droite)
3. Cliquez sur **"Create App"**
4. Choisissez **"Consumer"** comme type d'app
5. Remplissez le formulaire:
   - **App Name**: Ex: "Facebook TV Display"
   - **App Contact Email**: Votre email
   - **Purpose**: Développement personnel/Entreprise
6. Acceptez les conditions et cliquez **"Create App"**

---

## 🔑 Étape 2: Obtenir le Token d'Accès

### Méthode 1: Graph API Explorer (Recommandée)

1. Dans votre app Facebook, allez à:
   - **Tools and Support** → **Graph API Explorer**
   - Ou visitez directement: https://developers.facebook.com/tools/explorer

2. En haut du formulaire:
   - **Sélectionnez votre app** (dropdown gauche)
   - **Sélectionnez votre Page** (dropdown central)

3. Cliquez sur **"Generate Access Token"**

4. Une fenêtre popup demande les permissions:
   - Acceptez les permissions suggérées
   - Les permissions clés sont:
     - `pages_read_engagement` (voir les likes, commentaires)
     - `pages_read_user_content` (voir le contenu des posts)

5. **Copiez le token généré**
   - C'est une chaîne très longue commençant par `EAA...`
   - Exemple:
   ```
   EAABbKmJ7Z8kBAOZC3bJ7bKmJ7Z8kBAOZC3bJ7bKmJ7Z8kBAOZC3bJ7bKmJ7Z8kBAOZC3bJ7bKmJ7Z8k...
   ```

6. **Convertir en token à longue durée**:
   - Dans Graph API Explorer, allez à l'URL:
   ```
   https://graph.instagram.com/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN
   ```
   - Remplacez:
     - `YOUR_APP_ID`: Votre App ID (visible dans Paramètres → Basique)
     - `YOUR_APP_SECRET`: Votre App Secret (caché, cliquez sur "Afficher")
     - `SHORT_LIVED_TOKEN`: Le token que vous venez de générer

   Ou utilisez cet outil tiers:
   - https://www.fbgraph.com/access-token-tool.html

### Méthode 2: Via le Dashboard de l'App

1. Allez dans votre app Facebook → **Paramètres** → **Basique**
2. Scrollez jusqu'à **"App Domains"**
3. Ajoutez votre domaine local/produit
4. Allez dans **Tools** → **Access Token Tool**
5. Sélectionnez votre Page
6. Copiez le token

---

## 🆔 Étape 3: Obtenir l'ID de la Page

### Méthode 1: Via Facebook (Recommandée)

1. Ouvrez votre **Page Facebook** dans le navigateur
2. Cliquez sur **"À propos"** (dans le menu de gauche)
3. Scrollez vers le bas jusqu'à trouver une section de "Page Information"
4. Recherchez **"Page ID"** ou **"Numéro d'identification"**
5. **Copiez ce numéro** (exemple: `123456789`)

### Méthode 2: Via Graph API Explorer

1. Ouvrez https://developers.facebook.com/tools/explorer
2. Dans le formulaire, écrivez: `/me`
3. Cliquez sur "Submit"
4. Le JSON résultant contient votre `id`

### Méthode 3: Via un Site de Lookup

1. Visitez https://findmyfbid.com/
2. Entrez l'URL de votre page: `facebook.com/ma-page`
3. Cliquez "Search"
4. Copiez l'ID affiché

### Méthode 4: Via l'URL

Parfois, l'ID apparaît dans l'URL:
```
facebook.com/123456789/
```
Le `123456789` est votre Page ID.

---

## ✅ Vérifier que tout Fonctionne

Une fois que vous avez le token et l'ID:

### Test 1: Vérifier le Token

Ouvrez cette URL dans votre navigateur (remplacez le token):
```
https://graph.facebook.com/me?access_token=YOUR_TOKEN_HERE
```

Vous devriez voir un JSON avec votre information.

### Test 2: Vérifier l'Accès à la Page

Ouvrez cette URL (remplacez token et ID):
```
https://graph.facebook.com/YOUR_PAGE_ID?access_token=YOUR_TOKEN_HERE
```

Vous devriez voir les informations de votre page.

### Test 3: Vérifier les Posts

Ouvrez cette URL:
```
https://graph.facebook.com/YOUR_PAGE_ID/posts?access_token=YOUR_TOKEN_HERE
```

Vous devriez voir une liste de posts JSON.

---

## 🚨 Problèmes Courants

### "The access token is invalid"

**Cause**: Token expiré ou invalide

**Solution**:
1. Générez un nouveau token
2. Assurez-vous de copier le token complet
3. N'ajoutez pas d'espaces

### "Access Denied"

**Cause**: Permissions insuffisantes

**Solution**:
1. Retournez à Graph API Explorer
2. Cliquez sur le token en haut
3. Cliquez sur "Edit Permissions"
4. Activez:
   - `pages_read_engagement`
   - `pages_read_user_content`
5. Générez un nouveau token

### "Page does not exist"

**Cause**: ID de page invalide

**Solution**:
1. Vérifiez que l'ID est numérique
2. Utilisez FindMyFbId.com pour trouver l'ID correct
3. Assurez-vous que vous avez accès à cette page

### "No permission to access"

**Cause**: Vous n'êtes pas admin de la page

**Solution**:
1. Demandez l'accès admin à la page
2. Vous devez être admin pour accéder aux données de la page

---

## 🔒 Sécurité des Tokens

⚠️ **IMPORTANT**:

1. **Ne partagez JAMAIS votre token** - C'est comme un mot de passe
2. **Ne committez pas .env.local** - Il contient votre token
3. **Le .env.local est dans .gitignore** - Ne le poussez pas sur GitHub
4. Si vous avez accidentellement partagé un token:
   - Régénérez-le immédiatement
   - Les tokens exposés peuvent être réutilisés

---

## 🔄 Renouveler le Token

Les tokens à longue durée expirent après **60 jours** d'inactivité.

Pour renouveler:
1. Retournez à Graph API Explorer
2. Sélectionnez votre app et page
3. Générez un nouveau token
4. Mettez à jour `.env.local`
5. Redémarrez l'application

---

## 📞 Support

- 📖 [Facebook Developer Docs](https://developers.facebook.com/docs/graph-api)
- 🔍 [Graph API Explorer](https://developers.facebook.com/tools/explorer)
- 💬 [Facebook Developer Community](https://developers.facebook.com/community)

---

**Une fois configuré, vous êtes prêt! 🚀**
