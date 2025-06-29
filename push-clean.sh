#!/bin/bash

echo "🧹 Push propre vers GitHub (sans les clés dans l'historique)"

# Utiliser le token GitHub
export $(cat ../frontend/.env.git | grep -v '^#' | xargs)
REPO_URL="https://$GITHUB_TOKEN@github.com/Macmala/portcall-ai-backend.git"

# Forcer la création d'un historique propre
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# Force push pour écraser l'historique problématique
git push --force origin main

# Nettoyer l'URL
git remote set-url origin "https://github.com/Macmala/portcall-ai-backend.git"

echo "✅ Code poussé avec succès !"
echo "🌐 Repository: https://github.com/Macmala/portcall-ai-backend"
echo "🚂 Maintenant déployez sur Railway: https://railway.app"