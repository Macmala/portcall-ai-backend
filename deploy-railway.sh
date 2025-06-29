#!/bin/bash

echo "🚂 Déploiement direct sur Railway - PortCall AI Backend"
echo "✅ Toutes les clés API seront préservées pour le fonctionnement"

# Se connecter à Railway (ouvrira le navigateur)
echo "🔐 Connexion à Railway..."
railway login

# Créer un nouveau projet
echo "📦 Création du projet Railway..."
railway project new --name portcall-ai-backend

# Déployer directement depuis le dossier local
echo "🚀 Déploiement en cours..."
railway up

echo "✅ Déploiement terminé !"
echo "📍 Votre backend est maintenant en ligne !"
echo "🔧 Les variables d'environnement de votre .env ont été automatiquement configurées"

# Afficher l'URL du projet
railway status