import React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useSnake } from "../../lib/stores/useSnake";
import type { Direction } from "../../types/snake";

export function TouchControls() {
  const { setDirection, phase } = useSnake();
  
  const handleDirection = (direction: Direction) => {
    if (phase === "playing") {
      setDirection(direction);
      // Haptic feedback for mobile devices
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };
  
  if (phase === "ready" || phase === "ended") {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <Button
        variant="outline"
        size="lg"
        onTouchStart={(e) => {
          e.preventDefault();
          handleDirection("UP");
        }}
        onClick={() => handleDirection("UP")}
        className="w-16 h-16 p-0 bg-gray-800 border-gray-600 hover:bg-gray-700"
        style={{ touchAction: 'none' }}
      >
        <ChevronUp className="w-8 h-8" />
      </Button>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="lg"
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirection("LEFT");
          }}
          onClick={() => handleDirection("LEFT")}
          className="w-16 h-16 p-0 bg-gray-800 border-gray-600 hover:bg-gray-700"
          style={{ touchAction: 'none' }}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirection("RIGHT");
          }}
          onClick={() => handleDirection("RIGHT")}
          className="w-16 h-16 p-0 bg-gray-800 border-gray-600 hover:bg-gray-700"
          style={{ touchAction: 'none' }}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="lg"
        onTouchStart={(e) => {
          e.preventDefault();
          handleDirection("DOWN");
        }}
        onClick={() => handleDirection("DOWN")}
        className="w-16 h-16 p-0 bg-gray-800 border-gray-600 hover:bg-gray-700"
        style={{ touchAction: 'none' }}
      >
        <ChevronDown className="w-8 h-8" />
      </Button>
    </div>
  );
}
