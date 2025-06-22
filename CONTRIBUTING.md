# Guide de Contribution - Snake Game

Merci de votre intérêt pour contribuer au projet Snake Game !

## 🛠️ Configuration de développement

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### Installation
```bash
git clone https://github.com/MINIBOY-2D/SnakeBattle.git
cd SnakeBattle
npm install
npm run dev
```

## 📁 Structure du projet

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── lib/           # Utilitaires et stores
│   │   ├── types/         # Types TypeScript
│   │   └── pages/         # Pages de l'application
├── server/                # Backend Express
├── shared/                # Code partagé
└── docs/                  # Documentation
```

## 🎯 Comment contribuer

### 1. Signaler un bug
- Vérifiez d'abord si le bug n'est pas déjà signalé
- Créez une issue avec le template bug
- Incluez les étapes de reproduction

### 2. Proposer une fonctionnalité
- Ouvrez une issue avec le template feature
- Décrivez clairement le besoin
- Attendez l'approbation avant de commencer

### 3. Soumettre du code
1. Fork le repository
2. Créez une branche feature (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez vos changements (`git commit -m 'Ajout: ma fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Standards de code

### TypeScript
- Utilisez des types stricts
- Pas de `any` sauf cas exceptionnels
- Interfaces pour les objets complexes

### React
- Composants fonctionnels avec hooks
- Props typées avec interfaces
- Noms de composants en PascalCase

### CSS
- Tailwind CSS uniquement
- Classes utilitaires responsives
- Design mobile-first

### Git
- Messages de commit en français
- Format: `Type: description courte`
- Types: Ajout, Fix, Refactor, Style, Doc

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 🎨 UI/UX

- Interface en français
- Design sombre avec accents colorés
- Responsive mobile/desktop
- Accessibilité WCAG 2.1

## 🔐 Sécurité

- Pas de secrets dans le code
- Validation côté client et serveur
- Sanitisation des données utilisateur
- Protection anti-triche

## 📚 Documentation

- Code commenté en français
- README à jour
- Changelog maintenu
- Types documentés

## 🚀 Déploiement

- Tests passants obligatoires
- Build sans erreurs
- Performance vérifiée
- Compatibilité mobile testée

## 💬 Communication

- Issues et PR en français
- Discussions respectueuses
- Feedback constructif
- Réponses rapides

## 🏆 Reconnaissance

Les contributeurs sont listés dans le fichier CONTRIBUTORS.md et reconnus dans les releases.

Merci de faire grandir ce projet ensemble ! 🎮