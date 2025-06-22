# Snake Game - Ranked

Un jeu Snake moderne avec système de classement en temps réel, construit avec React, TypeScript et Firebase.

## 🎮 Fonctionnalités

- **Jeu Snake classique** avec graphismes modernes
- **Système de classement en temps réel** avec Firebase Firestore
- **Détection anti-triche** basée sur l'adresse IP
- **Interface française** complète
- **Contrôles tactiles** pour mobiles
- **Audio et effets sonores**
- **Synchronisation cross-device** des scores

## 🚀 Technologies

- **Frontend**: React 18, TypeScript, Three.js
- **Backend**: Express.js, Node.js
- **Base de données**: Firebase Firestore
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Build**: Vite

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/MINIBOY-2D/SnakeBattle.git
cd SnakeBattle

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🎯 Comment jouer

1. **Créer un pseudo** lors de votre première partie
2. **Contrôles**:
   - **Clavier**: WASD ou flèches directionnelles
   - **Mobile**: Contrôles tactiles
3. **Objectif**: Manger la nourriture pour grandir et obtenir des points
4. **Éviter**: Les collisions avec les murs et votre propre corps

## 🏆 Système de classement

- **Un seul pseudo par adresse IP** pour éviter la triche
- **Mise à jour automatique** des scores historiques lors du changement de pseudo
- **Suppression automatique** des anciens scores quand vous battez votre record
- **Synchronisation temps réel** entre tous les appareils

## 🔧 Configuration Firebase

Le projet utilise Firebase Firestore pour la sauvegarde des données. Les clés API sont configurées pour le projet `snake-ranked`.

## 📱 Responsive Design

- Interface adaptée mobile et desktop
- Contrôles tactiles optimisés
- Design moderne avec Tailwind CSS

## 🎵 Audio

- Musique de fond
- Effets sonores pour les actions du jeu
- Contrôle de volume intégré

## 🚀 Déploiement

Le projet est optimisé pour le déploiement sur Replit avec configuration automatique.

## 📄 License

Ce projet est sous licence MIT.

---

Développé avec ❤️ pour la communauté gaming française