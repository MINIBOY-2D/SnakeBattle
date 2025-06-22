# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versioning Sémantique](https://semver.org/lang/fr/).

## [1.0.0] - 2025-06-22

### Ajouté
- Jeu Snake complet avec HTML5 Canvas
- Système de classement en temps réel avec Firebase Firestore
- Gestion unique des joueurs avec pseudo personnalisable
- Détection anti-triche basée sur l'adresse IP
- Empreinte numérique du navigateur comme solution de secours
- Interface utilisateur en français
- Contrôles tactiles pour appareils mobiles
- Système audio avec effets sonores et musique de fond
- Synchronisation cross-device des scores
- Notifications visuelles pour nouveaux records
- Suppression automatique des anciens scores lors de nouveaux records
- Profil joueur avec gestion du pseudo
- Indicateur de statut de connexion Firebase
- Design responsive avec Tailwind CSS et shadcn/ui

### Technique
- React 18 avec TypeScript
- Three.js pour les graphismes 3D
- Zustand pour la gestion d'état
- Express.js backend
- Firebase Firestore pour la persistance
- Vite pour le build et développement
- Configuration Replit pour déploiement

### Sécurité
- Validation côté client et serveur
- Protection contre les comptes multiples
- Sanitisation des données utilisateur
- Gestion sécurisée des clés API Firebase

## [0.1.0] - 2025-06-22

### Ajouté
- Configuration initiale du projet
- Structure de base React + Express
- Première version du jeu Snake
- Système de stockage local

---

## Format des types de changements

- **Ajouté** pour les nouvelles fonctionnalités
- **Modifié** pour les changements dans les fonctionnalités existantes
- **Déprécié** pour les fonctionnalités qui seront supprimées prochainement
- **Supprimé** pour les fonctionnalités supprimées
- **Corrigé** pour les corrections de bugs
- **Sécurité** pour les vulnérabilités corrigées