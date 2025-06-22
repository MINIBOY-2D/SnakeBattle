import React, { useRef, useEffect, useCallback } from "react";
import { useSnake } from "../../lib/stores/useSnake";

interface GameBoardProps {
  width: number;
  height: number;
}

export function GameBoard({ width, height }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const {
    snake,
    food,
    settings,
    phase,
    update,
  } = useSnake();
  
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines (optional, for better visibility)
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += settings.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += settings.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#4ade80" : "#22c55e"; // Head is lighter green
      ctx.fillRect(
        segment.x * settings.gridSize,
        segment.y * settings.gridSize,
        settings.gridSize - 1,
        settings.gridSize - 1
      );
      
      // Add eyes to the head
      if (index === 0) {
        ctx.fillStyle = "#000";
        const eyeSize = 3;
        const eyeOffset = settings.gridSize / 4;
        ctx.fillRect(
          segment.x * settings.gridSize + eyeOffset,
          segment.y * settings.gridSize + eyeOffset,
          eyeSize,
          eyeSize
        );
        ctx.fillRect(
          segment.x * settings.gridSize + settings.gridSize - eyeOffset - eyeSize,
          segment.y * settings.gridSize + eyeOffset,
          eyeSize,
          eyeSize
        );
      }
    });
    
    // Draw food
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(
      food.x * settings.gridSize + settings.gridSize / 2,
      food.y * settings.gridSize + settings.gridSize / 2,
      settings.gridSize / 2 - 1,
      0,
      2 * Math.PI
    );
    ctx.fill();
    
    // Add a small highlight to the food
    ctx.fillStyle = "#fca5a5";
    ctx.beginPath();
    ctx.arc(
      food.x * settings.gridSize + settings.gridSize / 2 - 2,
      food.y * settings.gridSize + settings.gridSize / 2 - 2,
      3,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [snake, food, settings, width, height]);
  
  const gameLoop = useCallback((currentTime: number) => {
    update(currentTime);
    draw();
    
    if (phase === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [update, draw, phase]);
  
  useEffect(() => {
    if (phase === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Draw the current state even when not playing
      draw();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, gameLoop, draw]);
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border-2 border-gray-600 rounded-lg bg-gray-900"
      style={{ touchAction: 'none' }}
    />
  );
}
