#!/bin/bash

# Script de démarrage Facebook TV Display

echo "======================================"
echo "   Facebook TV Display - Démarrage   "
echo "======================================"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "Téléchargez-le sur: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm $(npm -v) détecté"
echo ""

# Vérifier .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  Fichier .env.local non trouvé"
    echo "Création à partir de .env.example..."
    cp .env.example .env.local
    echo ""
    echo "📝 Veuillez remplir .env.local avec vos credentials Facebook:"
    echo "   - VITE_FACEBOOK_ACCESS_TOKEN"
    echo "   - VITE_FACEBOOK_PAGE_ID"
    echo ""
    echo "Puis relancez ce script."
    exit 0
fi

# Vérifier que le token est configuré
if grep -q "your_access_token_here" .env.local; then
    echo "❌ VITE_FACEBOOK_ACCESS_TOKEN non configuré"
    echo "Veuillez modifier .env.local"
    exit 1
fi

if grep -q "your_page_id_here" .env.local; then
    echo "❌ VITE_FACEBOOK_PAGE_ID non configuré"
    echo "Veuillez modifier .env.local"
    exit 1
fi

echo "✅ Configuration trouvée"
echo ""

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

echo "🚀 Démarrage de l'application..."
echo "   URL: http://localhost:5173"
echo ""
echo "💡 Utilisez Ctrl+C pour arrêter"
echo ""

npm run dev
