# Documentation API - Snake Game

## Vue d'ensemble

L'API du jeu Snake utilise Firebase Firestore pour la persistance des données et Express.js pour les routes backend.

## Configuration Firebase

### Initialisation
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Configuration automatique via variables d'environnement
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

## Collections Firestore

### Collection `players`
Structure des documents joueurs :
```typescript
interface Player {
  id: string;           // ID unique du joueur
  name: string;         // Pseudo du joueur
  ipAddress: string;    // Adresse IP pour anti-triche
  createdAt: number;    // Timestamp de création
  updatedAt: number;    // Timestamp de dernière mise à jour
}
```

### Collection `leaderboard`
Structure des scores :
```typescript
interface LeaderboardEntry {
  id: string;           // ID unique du score
  playerId: string;     // Référence au joueur
  playerName: string;   // Nom du joueur (dénormalisé)
  score: number;        // Score obtenu
  length: number;       // Longueur du snake
  timestamp: number;    // Date du score
  ipAddress: string;    // IP pour validation
}
```

## API Hooks

### `useFirebasePlayer`

Gestion des joueurs avec détection d'IP :

```typescript
const {
  playerId,
  playerName,
  loading,
  error,
  initializePlayer,
  createOrGetPlayer,
  updatePlayerName,
  getPlayer,
  clearPlayer
} = useFirebasePlayer();
```

#### Méthodes

- `initializePlayer()` : Initialise le joueur automatiquement
- `createOrGetPlayer(name, ip)` : Crée ou récupère un joueur
- `updatePlayerName(newName)` : Met à jour le pseudo
- `getPlayer()` : Retourne les infos du joueur actuel
- `clearPlayer()` : Nettoie les données locales

### `useFirebaseLeaderboard`

Gestion du classement en temps réel :

```typescript
const {
  entries,
  loading,
  error,
  loadLeaderboard,
  addEntry,
  updatePlayerName,
  getTopEntries,
  getPlayerEntries,
  getPlayerBestScore,
  getRank,
  subscribeToLeaderboard
} = useFirebaseLeaderboard();
```

#### Méthodes

- `loadLeaderboard()` : Charge le classement initial
- `addEntry(playerId, name, score, length, ip)` : Ajoute un nouveau score
- `updatePlayerName(playerId, newName)` : Met à jour tous les scores d'un joueur
- `getTopEntries(limit)` : Retourne le top N des scores
- `getPlayerEntries(playerId)` : Scores d'un joueur spécifique
- `getPlayerBestScore(playerId)` : Meilleur score d'un joueur
- `getRank(score)` : Position d'un score dans le classement
- `subscribeToLeaderboard()` : Écoute en temps réel

## Détection d'IP

### `getUserIP()`

Fonction utilitaire pour obtenir l'adresse IP :

```typescript
const ip = await getUserIP();
```

Services utilisés en cascade :
1. `https://api.ipify.org?format=json`
2. `https://httpbin.org/ip`
3. `https://api.ip.sb/ip`
4. Empreinte numérique du navigateur (fallback)

## Règles de sécurité

### Anti-triche
- Un seul joueur par adresse IP
- Validation des scores côté serveur
- Empreinte navigateur comme fallback
- Sanitisation des données utilisateur

### Validation des données
```typescript
// Validation pseudo
const isValidName = (name: string) => 
  name.length >= 2 && name.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(name);

// Validation score
const isValidScore = (score: number) => 
  Number.isInteger(score) && score >= 0 && score <= 999999;
```

## Gestion des erreurs

### Types d'erreurs
- `NETWORK_ERROR` : Problème de connexion
- `PERMISSION_DENIED` : Erreur d'authentification Firebase
- `DUPLICATE_PLAYER` : Tentative de création de compte multiple
- `INVALID_DATA` : Données invalides

### Gestion automatique
- Retry automatique sur les erreurs réseau
- Fallback vers empreinte navigateur
- Messages d'erreur localisés en français

## Performance

### Optimisations
- Pagination automatique du classement (50 entrées max)
- Cache local avec synchronisation
- Debouncing des mises à jour
- Lazy loading des composants

### Métriques
- Temps de chargement < 2s
- Synchronisation temps réel < 500ms
- Taille bundle < 1MB gzippé

## Exemples d'utilisation

### Création d'un nouveau joueur
```typescript
const handleCreatePlayer = async (name: string) => {
  try {
    const ip = await getUserIP();
    const playerId = await createOrGetPlayer(name, ip);
    console.log('Joueur créé:', playerId);
  } catch (error) {
    console.error('Erreur création:', error);
  }
};
```

### Ajout d'un score
```typescript
const handleGameEnd = async (score: number, length: number) => {
  try {
    const player = getPlayer();
    if (player) {
      const ip = await getUserIP();
      await addEntry(player.id, player.name, score, length, ip);
    }
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
  }
};
```

### Écoute du classement
```typescript
useEffect(() => {
  const unsubscribe = subscribeToLeaderboard();
  return unsubscribe; // Cleanup automatique
}, []);
```