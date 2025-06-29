#!/bin/bash

echo "🚂 Déploiement Railway - PortCall AI Backend"
echo "📁 Dossier actuel: $(pwd)"

# Supprimer toute référence git pour éviter les conflits
rm -rf .git
rm -f .env.git
rm -f push-backend.sh

# Initialiser un nouveau repo git propre
git init
git add .
git commit -m "PortCall AI Backend ready for Railway"

echo "🔐 Maintenant connectez-vous à Railway dans votre navigateur..."
railway login

echo "📦 Création du projet Railway..."
railway project new

echo "🚀 Déploiement en cours..."
railway up

echo "✅ Déploiement terminé ! Récupérons l'URL..."
railway status

echo ""
echo "🌐 Votre backend PortCall AI est maintenant en ligne !"
echo "📋 Copiez l'URL affichée ci-dessus pour mettre à jour le frontend"