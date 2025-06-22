import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Position, SnakeSegment, Food, Direction, GameSettings } from "../../types/snake";

export type GamePhase = "ready" | "playing" | "paused" | "ended";

interface SnakeState {
  // Game state
  phase: GamePhase;
  score: number;
  snake: SnakeSegment[];
  food: Food;
  direction: Direction;
  nextDirection: Direction;
  speed: number;
  lastUpdateTime: number;
  
  // Game settings
  settings: GameSettings;
  
  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  end: () => void;
  setDirection: (direction: Direction) => void;
  update: (currentTime: number) => void;
  
  // Helper functions
  generateFood: () => Food;
  checkCollision: () => boolean;
  checkFoodCollision: () => boolean;
  moveSnake: () => void;
}

const INITIAL_SETTINGS: GameSettings = {
  gridSize: 20,
  canvasWidth: 600,
  canvasHeight: 400,
  initialSpeed: 150, // milliseconds per move
  speedIncrement: 5,
  maxSpeed: 80,
};

const INITIAL_SNAKE: SnakeSegment[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export const useSnake = create<SnakeState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    phase: "ready",
    score: 0,
    snake: [...INITIAL_SNAKE],
    food: { x: 15, y: 15 },
    direction: "RIGHT",
    nextDirection: "RIGHT",
    speed: INITIAL_SETTINGS.initialSpeed,
    lastUpdateTime: 0,
    settings: INITIAL_SETTINGS,
    
    generateFood: () => {
      const { settings, snake } = get();
      const gridWidth = Math.floor(settings.canvasWidth / settings.gridSize);
      const gridHeight = Math.floor(settings.canvasHeight / settings.gridSize);
      
      let newFood: Food;
      let attempts = 0;
      const maxAttempts = 100;
      
      do {
        newFood = {
          x: Math.floor(Math.random() * gridWidth),
          y: Math.floor(Math.random() * gridHeight),
        };
        attempts++;
      } while (
        attempts < maxAttempts &&
        snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
      );
      
      return newFood;
    },
    
    checkCollision: () => {
      const { snake, settings } = get();
      const head = snake[0];
      const gridWidth = Math.floor(settings.canvasWidth / settings.gridSize);
      const gridHeight = Math.floor(settings.canvasHeight / settings.gridSize);
      
      // Wall collision
      if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        return true;
      }
      
      // Self collision
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          return true;
        }
      }
      
      return false;
    },
    
    checkFoodCollision: () => {
      const { snake, food } = get();
      const head = snake[0];
      return head.x === food.x && head.y === food.y;
    },
    
    moveSnake: () => {
      set((state) => {
        const newSnake = [...state.snake];
        const head = { ...newSnake[0] };
        
        // Use nextDirection for actual movement
        switch (state.nextDirection) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }
        
        newSnake.unshift(head);
        
        // Check if food was eaten
        if (state.checkFoodCollision()) {
          const newScore = state.score + 10;
          const newSpeed = Math.max(
            state.settings.maxSpeed,
            state.speed - state.settings.speedIncrement
          );
          
          return {
            snake: newSnake,
            food: state.generateFood(),
            score: newScore,
            speed: newSpeed,
            direction: state.nextDirection,
          };
        } else {
          // Remove tail if no food eaten
          newSnake.pop();
          return {
            snake: newSnake,
            direction: state.nextDirection,
          };
        }
      });
    },
    
    start: () => {
      set((state) => {
        if (state.phase === "ready") {
          return {
            phase: "playing",
            lastUpdateTime: performance.now(),
          };
        }
        return {};
      });
    },
    
    pause: () => {
      set((state) => {
        if (state.phase === "playing") {
          return { phase: "paused" };
        }
        return {};
      });
    },
    
    resume: () => {
      set((state) => {
        if (state.phase === "paused") {
          return {
            phase: "playing",
            lastUpdateTime: performance.now(),
          };
        }
        return {};
      });
    },
    
    restart: () => {
      set(() => ({
        phase: "ready",
        score: 0,
        snake: [...INITIAL_SNAKE],
        food: { x: 15, y: 15 },
        direction: "RIGHT",
        nextDirection: "RIGHT",
        speed: INITIAL_SETTINGS.initialSpeed,
        lastUpdateTime: 0,
      }));
    },
    
    end: () => {
      set((state) => {
        if (state.phase === "playing") {
          return { phase: "ended" };
        }
        return {};
      });
    },
    
    setDirection: (newDirection: Direction) => {
      set((state) => {
        // Prevent reversing into itself
        const opposites: Record<Direction, Direction> = {
          UP: "DOWN",
          DOWN: "UP",
          LEFT: "RIGHT",
          RIGHT: "LEFT",
        };
        
        if (opposites[newDirection] !== state.direction) {
          return { nextDirection: newDirection };
        }
        return {};
      });
    },
    
    update: (currentTime: number) => {
      const state = get();
      
      if (state.phase !== "playing") return;
      
      if (currentTime - state.lastUpdateTime >= state.speed) {
        state.moveSnake();
        
        if (state.checkCollision()) {
          state.end();
        }
        
        set({ lastUpdateTime: currentTime });
      }
    },
  }))
);
