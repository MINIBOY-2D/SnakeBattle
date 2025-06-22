import React, { useEffect, useState } from "react";
import { Trophy, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScoreNotificationProps {
  isNewRecord: boolean;
  score: number;
  previousBest: number;
  show: boolean;
  onComplete: () => void;
}

export function ScoreNotification({ 
  isNewRecord, 
  score, 
  previousBest, 
  show, 
  onComplete 
}: ScoreNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // Show for 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`
            px-6 py-4 rounded-lg shadow-lg border-2 max-w-sm mx-auto
            ${isNewRecord 
              ? "bg-gradient-to-r from-yellow-900 to-amber-900 border-yellow-500 text-yellow-100" 
              : "bg-gradient-to-r from-green-900 to-emerald-900 border-green-500 text-green-100"
            }
          `}>
            <div className="flex items-center gap-3">
              {isNewRecord ? (
                <Trophy className="w-6 h-6 text-yellow-400" />
              ) : (
                <TrendingUp className="w-6 h-6 text-green-400" />
              )}
              
              <div>
                <div className="font-bold text-lg">
                  {isNewRecord ? "Nouveau Record !" : "Score Enregistré !"}
                </div>
                <div className="text-sm opacity-90">
                  {isNewRecord 
                    ? `${score} points (ancien: ${previousBest})`
                    : `${score} points ajoutés`
                  }
                </div>
                {isNewRecord && (
                  <div className="text-xs opacity-75 mt-1">
                    Anciens scores supprimés
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}