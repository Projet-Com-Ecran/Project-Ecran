@echo off
chcp 65001 >nul

echo.
echo ======================================
echo    Facebook TV Display - Démarrage
echo ======================================
echo.

REM Vérifier Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé
    echo Téléchargez-le sur: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% détecté

REM Vérifier npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% détecté
echo.

REM Vérifier .env.local
if not exist ".env.local" (
    echo ⚠️  Fichier .env.local non trouvé
    echo Création à partir de .env.example...
    copy .env.example .env.local
    echo.
    echo 📝 Veuillez remplir .env.local avec vos credentials Facebook:
    echo    - VITE_FACEBOOK_ACCESS_TOKEN
    echo    - VITE_FACEBOOK_PAGE_ID
    echo.
    echo Puis relancez ce script.
    pause
    exit /b 0
)

REM Vérifier que le token est configuré
findstr /m "your_access_token_here" .env.local >nul
if %errorlevel% equ 0 (
    echo ❌ VITE_FACEBOOK_ACCESS_TOKEN non configuré
    echo Veuillez modifier .env.local
    pause
    exit /b 1
)

findstr /m "your_page_id_here" .env.local >nul
if %errorlevel% equ 0 (
    echo ❌ VITE_FACEBOOK_PAGE_ID non configuré
    echo Veuillez modifier .env.local
    pause
    exit /b 1
)

echo ✅ Configuration trouvée
echo.

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    call npm install
    echo.
)

echo 🚀 Démarrage de l'application...
echo    URL: http://localhost:5173
echo.
echo 💡 Utilisez Ctrl+C pour arrêter
echo.

call npm run dev
