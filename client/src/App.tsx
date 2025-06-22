import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameBoard } from "./components/Snake/GameBoard";
import { GameUI } from "./components/Snake/GameUI";
import { TouchControls } from "./components/Snake/TouchControls";
import { PlayerProfile } from "./components/Snake/PlayerProfile";
import { useSnake } from "./lib/stores/useSnake";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

const queryClient = new QueryClient();

function SnakeGame() {
  const { setDirection, phase } = useSnake();
  const { setHitSound, setSuccessSound, setBackgroundMusic } = useAudio();
  
  // Initialize audio
  useEffect(() => {
    const hitAudio = new Audio("/sounds/hit.mp3");
    const successAudio = new Audio("/sounds/success.mp3");
    const backgroundAudio = new Audio("/sounds/background.mp3");
    
    hitAudio.volume = 0.3;
    successAudio.volume = 0.5;
    backgroundAudio.volume = 0.2;
    backgroundAudio.loop = true;
    
    setHitSound(hitAudio);
    setSuccessSound(successAudio);
    setBackgroundMusic(backgroundAudio);
  }, [setHitSound, setSuccessSound, setBackgroundMusic]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (phase !== "playing") return;
      
      switch (event.key.toLowerCase()) {
        case "arrowup":
        case "w":
          event.preventDefault();
          setDirection("UP");
          break;
        case "arrowdown":
        case "s":
          event.preventDefault();
          setDirection("DOWN");
          break;
        case "arrowleft":
        case "a":
          event.preventDefault();
          setDirection("LEFT");
          break;
        case "arrowright":
        case "d":
          event.preventDefault();
          setDirection("RIGHT");
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [setDirection, phase]);
  
  return (
    <div 
      className="min-h-screen bg-gray-950 text-white p-4"
      style={{ touchAction: 'none' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            🐍 Snake Game
          </h1>
          <p className="text-gray-400">
            Classic Snake with ranking system - Eat food, grow longer, avoid collisions!
          </p>
        </div>
        
        {/* Game Layout */}
        <div className="flex flex-col xl:flex-row gap-6 items-start justify-center">
          {/* Left Sidebar - Player Profile */}
          <div className="w-full xl:w-80 order-2 xl:order-1">
            <PlayerProfile />
          </div>
          
          {/* Game Board */}
          <div className="flex flex-col items-center gap-4 order-1 xl:order-2">
            <GameBoard width={600} height={400} />
            
            {/* Touch Controls - Show on smaller screens */}
            <div className="lg:hidden">
              <TouchControls />
            </div>
          </div>
          
          {/* Game UI */}
          <div className="w-full xl:w-80 order-3">
            <GameUI />
          </div>
        </div>
        
        {/* Desktop Touch Controls - Hidden on mobile */}
        <div className="hidden lg:flex justify-center mt-6">
          <TouchControls />
        </div>
        
        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
          <p className="mb-2">
            <strong>How to Play:</strong> Use arrow keys or WASD to control the snake. 
            Eat the red food to grow longer and increase your score. 
            Avoid hitting the walls or your own tail!
          </p>
          <p>
            The game speeds up as your snake grows longer. Try to achieve the highest score 
            and climb the leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SnakeGame />
    </QueryClientProvider>
  );
}

export default App;
