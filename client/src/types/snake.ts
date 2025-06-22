export interface Position {
  x: number;
  y: number;
}

export interface SnakeSegment extends Position {}

export interface Food extends Position {}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameSettings {
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
  initialSpeed: number;
  speedIncrement: number;
  maxSpeed: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  length: number;
  timestamp: number;
}
