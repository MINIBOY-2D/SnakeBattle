# Guide de déploiement - Snake Game

## Déploiement sur Replit

### Configuration automatique
Le projet est optimisé pour Replit avec les fichiers de configuration suivants :
- `.replit` : Configuration de l'environnement
- `replit.nix` : Dépendances système
- Scripts npm configurés

### Variables d'environnement
Les clés Firebase sont configurées automatiquement pour le projet `snake-ranked`.

### Commandes de déploiement
```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrage du serveur
npm start
```

## Déploiement sur d'autres plateformes

### Vercel
1. Connecter le repository GitHub
2. Configurer les variables d'environnement Firebase
3. Build automatique à chaque push

### Netlify
1. Import du repository
2. Configuration du build :
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Variables d'environnement Firebase

### Railway
1. Connecter GitHub
2. Configuration automatique détectée
3. Variables d'environnement à configurer

## Configuration Firebase

### Variables requises
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Règles de sécurité Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les joueurs
    match /players/{playerId} {
      allow read, write: if true;
    }
    
    // Règles pour le classement
    match /leaderboard/{entryId} {
      allow read: if true;
      allow write: if request.auth == null || true;
    }
  }
}
```

## Optimisations de production

### Build optimisé
- Tree shaking automatique
- Minification CSS/JS
- Compression des assets
- Code splitting par routes

### Performance
- Bundle size < 1MB gzippé
- Lazy loading des composants
- Service worker pour le cache
- Images optimisées

### SEO
- Meta tags configurés
- Open Graph pour partage social
- Structured data pour les scores
- Sitemap.xml généré

## Monitoring

### Métriques à surveiller
- Temps de chargement des pages
- Erreurs JavaScript côté client
- Latence Firebase
- Taux de conversion joueurs

### Outils recommandés
- Google Analytics pour l'usage
- Sentry pour les erreurs
- Firebase Performance Monitoring
- Lighthouse pour les performances

## Sécurité en production

### Headers de sécurité
```nginx
# À configurer sur le serveur web
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

### Validation des données
- Sanitisation côté client et serveur
- Validation des scores avant sauvegarde
- Rate limiting sur les API
- Protection CSRF

## Backup et récupération

### Sauvegarde Firebase
- Export automatique quotidien
- Sauvegarde du code dans GitHub
- Documentation des configurations
- Plan de récupération documenté

### Tests de récupération
- Tests réguliers de restauration
- Procédures documentées
- Contacts d'urgence définis
- Monitoring des sauvegardes

## Maintenance

### Mises à jour
- Dépendances npm à jour
- Patches de sécurité appliqués
- Tests avant déploiement
- Rollback plan disponible

### Monitoring continu
- Alertes sur les erreurs
- Surveillance des performances
- Vérification des sauvegardes
- Rapports de santé hebdomadaires