# Instructions de déploiement Railway

## 1. Créer le repository GitHub
1. Allez sur https://github.com/new
2. Nom: `portcall-ai-backend`
3. Public
4. NE PAS ajouter README

## 2. Pousser le code
```bash
git remote add origin https://github.com/Macmala/portcall-ai-backend.git
git push -u origin main
```

## 3. Déployer sur Railway
1. Allez sur https://railway.app
2. Connectez votre compte GitHub
3. Cliquez "Deploy from GitHub repo"
4. Sélectionnez `Macmala/portcall-ai-backend`
5. Railway détectera automatiquement Node.js

## 4. Configurer les variables d'environnement
Dans Railway, ajoutez les variables d'environnement depuis votre fichier .env :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` 
- `PERPLEXITY_API_KEY`
- `PORT` (sera défini automatiquement par Railway)

## 5. Mettre à jour le frontend
Une fois déployé, Railway vous donnera une URL comme:
`https://portcall-ai-backend-production.up.railway.app`

Mettre à jour `.env.production` dans le frontend avec cette URL.