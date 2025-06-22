# Configuration GitHub - Snake Game

## Synchronisation avec le repository

Le projet est maintenant configuré pour être synchronisé avec votre repository GitHub : `https://github.com/MINIBOY-2D/SnakeBattle`

## Fichiers créés pour GitHub

### Documentation complète
- `README.md` - Description du projet en français
- `CONTRIBUTING.md` - Guide de contribution
- `CHANGELOG.md` - Historique des versions
- `LICENSE` - Licence MIT
- `CONTRIBUTORS.md` - Liste des contributeurs
- `docs/API.md` - Documentation de l'API
- `docs/DEPLOYMENT.md` - Guide de déploiement

### Configuration CI/CD
- `.github/workflows/deploy.yml` - Déploiement automatique
- `.gitignore` - Fichiers à ignorer dans Git

## Étapes pour synchroniser

### 1. Depuis Replit
```bash
# Le repository Git est déjà initialisé
# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: Snake Game avec Firebase"

# Ajouter l'origine remote
git remote add origin https://github.com/MINIBOY-2D/SnakeBattle.git

# Push vers GitHub
git push -u origin main
```

### 2. Variables d'environnement sur GitHub
Configurer ces secrets dans GitHub Actions :

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=snake-ranked.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=snake-ranked
VITE_FIREBASE_STORAGE_BUCKET=snake-ranked.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Configuration du déploiement
Le workflow GitHub Actions est configuré pour :
- Tester le code automatiquement
- Construire le projet
- Déployer sur Vercel (optionnel)

## Structure des fichiers

```
SnakeBattle/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── client/
│   ├── public/
│   └── src/
├── server/
├── shared/
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── CONTRIBUTORS.md
└── .gitignore
```

## Fonctionnalités GitHub

### Issues et Pull Requests
- Templates configurés pour les bugs et fonctionnalités
- Labels automatiques pour organisation
- Workflow de review pour les contributions

### Releases
- Tags automatiques pour les versions
- Notes de release générées depuis CHANGELOG.md
- Assets de build attachés aux releases

### Protection des branches
Recommandations pour la branche `main` :
- Require pull request reviews
- Require status checks (tests)
- Restrict pushes to admins

## Collaboration

### Pour les contributeurs
1. Fork le repository
2. Créer une branche feature
3. Faire les modifications
4. Créer une Pull Request
5. Attendre la review et merge

### Pour les mainteneurs
1. Review des Pull Requests
2. Merge vers main déclenche le déploiement
3. Création de releases pour les versions majeures

## Badges pour README

Ajouter ces badges au README.md :

```markdown
![Build Status](https://github.com/MINIBOY-2D/SnakeBattle/workflows/Deploy%20to%20Production/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
```

## Prochaines étapes

1. Pousser le code vers GitHub
2. Configurer les secrets d'environnement
3. Tester le workflow de déploiement
4. Configurer la protection des branches
5. Inviter les collaborateurs si nécessaire