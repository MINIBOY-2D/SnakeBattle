# Snake Game - Ranked

## Overview
A modern 3D Snake game built with React, TypeScript, and Three.js. This is a full-stack web application featuring real-time gameplay, local leaderboards, audio effects, and mobile-responsive controls. The game combines classic Snake mechanics with modern web technologies and a polished user interface.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Three.js** via `@react-three/fiber` and `@react-three/drei` for 3D graphics rendering
- **Zustand** for lightweight state management across game components
- **Tailwind CSS** with **shadcn/ui** components for modern, accessible UI design
- **Vite** as the build tool and development server

### Backend Architecture
- **Express.js** server with TypeScript support
- **RESTful API** structure ready for future multiplayer features
- **In-memory storage** with interface for easy database migration
- **Session management** prepared for user authentication

### Data Storage Solutions
- **Drizzle ORM** configured for PostgreSQL (via Neon Database)
- **Local storage** for game preferences and temporary data
- **Memory storage** implementation as fallback/development option
- Database schema prepared for users and game statistics

## Key Components

### Game Engine
- **Snake State Management**: Real-time game state with collision detection
- **Game Loop**: RAF-based game loop with configurable speed scaling
- **Physics**: Grid-based movement with direction queuing
- **Audio System**: Contextual sound effects with mute controls

### User Interface
- **Responsive Design**: Mobile-first approach with touch controls
- **Game States**: Ready, playing, paused, and ended states
- **Leaderboard**: Local rankings with persistent storage
- **Controls**: Keyboard (WASD/Arrows) and touch support

### 3D Graphics
- **Three.js Integration**: Canvas-based rendering with React integration
- **Custom Geometries**: GLTF model support for game assets
- **Shader Support**: GLSL shader integration via vite-plugin-glsl

## Data Flow

1. **Game Initialization**: Zustand stores initialize game state and settings
2. **Input Handling**: Keyboard/touch events update direction in snake store
3. **Game Loop**: RAF-based updates trigger state changes and collision detection
4. **Rendering**: React components render game board and UI based on state
5. **Audio**: Sound effects triggered by game events (food collection, collision)
6. **Persistence**: Game scores saved to local storage and leaderboard

## External Dependencies

### Core Framework
- React ecosystem: `react`, `react-dom`, `@types/react`
- Build tools: `vite`, `typescript`, `tsx`
- Three.js: `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`

### UI & Styling
- `tailwindcss` with `autoprefixer` and `postcss`
- Radix UI primitives for accessible components
- `lucide-react` for icons
- `@fontsource/inter` for typography

### State & Data
- `zustand` for state management
- `@tanstack/react-query` for server state (future use)
- `drizzle-orm` and `@neondatabase/serverless` for database

### Development
- `esbuild` for production builds
- `drizzle-kit` for database migrations
- Various type definitions and utilities

## Deployment Strategy

### Development Environment
- **Replit** hosting with Node.js 20 runtime
- **Hot reload** via Vite development server
- **Port configuration**: Local 5000, external 80

### Production Build
- **Build process**: Vite frontend build + esbuild server bundle
- **Static assets**: Served from Express with Vite middleware in development
- **Autoscale deployment** target for production scaling

### Database
- **Neon PostgreSQL** for production data persistence
- **Environment variables** for database connection configuration
- **Migration system** ready via Drizzle Kit

## Changelog
- June 22, 2025. Initial setup
- June 22, 2025. Implemented unique player system with pseudo management
- June 22, 2025. Connected project with GitHub repository https://github.com/MINIBOY-2D/SnakeBattle

## User Preferences
Preferred communication style: Simple, everyday language (French for UI elements).

## Recent Changes
- Created unique player ID system with persistent storage
- Players can now create one pseudo and update it later
- All historical scores update when player changes their name
- Added PlayerProfile component for player management
- Enhanced leaderboard to highlight current player's scores
- Integrated player system with game scoring and leaderboard
- Implemented score replacement system: when player beats their best score, old scores are automatically deleted
- Added visual notification system for new records vs regular scores
- Enhanced French localization for user interface elements
- Integrated Firebase Firestore for cloud data storage
- Added IP-based player detection to prevent multiple accounts
- Removed leaderboard clear button for regular users
- Added real-time leaderboard synchronization across devices
- Implemented browser fingerprinting as IP detection fallback