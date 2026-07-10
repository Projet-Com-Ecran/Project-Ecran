# ⚡ Démarrage Rapide (5 minutes)

## Si vous êtes pressé, c'est ici!

### 1️⃣ Installer (1 min)

```bash
cd facebook-tv-display
npm install
```

### 2️⃣ Configurer (2 min)

```bash
# Créer le fichier de config
copy .env.example .env.local    # Windows
# OU
cp .env.example .env.local      # macOS/Linux
```

Ouvrez `.env.local` et remplissez:

```env
VITE_FACEBOOK_ACCESS_TOKEN=VOTRE_TOKEN
VITE_FACEBOOK_PAGE_ID=VOTRE_ID
```

**Comment obtenir les credentials?** → Voir [CREDENTIALS.md](CREDENTIALS.md)

### 3️⃣ Lancer (1 min)

```bash
npm run dev
```

Ouvrez: **http://localhost:5173**

### 4️⃣ Fullscreen (1 min)

Pressez **F11** pour le mode plein écran

**C'est prêt! 🎉**

---

## Commandes Utiles

```bash
# Développement
npm run dev        # Lancer le serveur dev

# Build production
npm run build      # Compiler
npm run preview    # Prévisualiser le build

# Linting
npm run lint       # Vérifier le code
```

---

## Problème Rapide?

| Problème | Solution |
|----------|----------|
| "Configuration manquante" | Remplissez `.env.local` → [CREDENTIALS.md](CREDENTIALS.md) |
| "Invalid token" | Générez un nouveau token → [CREDENTIALS.md](CREDENTIALS.md) |
| "No posts" | Votre page a peut-être pas de posts publics |
| Autre erreur | Voir [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |

---

## Prochaines Étapes

- 📖 Lire [README.md](README.md) pour la documentation complète
- 🔧 Voir [SETUP.md](SETUP.md) pour la configuration avancée
- 📋 Vérifier [FEATURES.md](FEATURES.md) pour les fonctionnalités
- 🏗️ Lire [ARCHITECTURE.md](ARCHITECTURE.md) pour la structure du code

---

**Let's go! 🚀**
