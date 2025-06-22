import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LeaderboardEntry } from "../../types/snake";

interface LeaderboardState {
  entries: LeaderboardEntry[];
  
  // Actions
  addEntry: (playerId: string, playerName: string, score: number, length: number) => LeaderboardEntry;
  updatePlayerName: (playerId: string, newName: string) => void;
  getTopEntries: (limit?: number) => LeaderboardEntry[];
  getPlayerEntries: (playerId: string) => LeaderboardEntry[];
  getPlayerBestScore: (playerId: string) => number;
  getRank: (score: number) => number;
  clearLeaderboard: () => void;
}

export const useLeaderboard = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      entries: [],
      
      addEntry: (playerId: string, playerName: string, score: number, length: number) => {
        const newEntry: LeaderboardEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          playerId,
          playerName: playerName.trim() || "Anonymous",
          score,
          length,
          timestamp: Date.now(),
        };
        
        set((state) => {
          // Find existing entries for this player
          const existingPlayerEntries = state.entries.filter(entry => entry.playerId === playerId);
          const playerBestScore = existingPlayerEntries.length > 0 
            ? Math.max(...existingPlayerEntries.map(entry => entry.score)) 
            : 0;
          
          let updatedEntries = [...state.entries];
          
          // If new score is better than player's best, remove all previous scores for this player
          if (score > playerBestScore) {
            updatedEntries = state.entries.filter(entry => entry.playerId !== playerId);
          }
          
          // Add the new entry
          updatedEntries.push(newEntry);
          
          // Sort and keep top 100
          const finalEntries = updatedEntries
            .sort((a, b) => b.score - a.score)
            .slice(0, 100);
          
          return { entries: finalEntries };
        });
        
        return newEntry;
      },
      
      updatePlayerName: (playerId: string, newName: string) => {
        set((state) => {
          const updatedEntries = state.entries.map(entry => 
            entry.playerId === playerId 
              ? { ...entry, playerName: newName.trim() || "Anonymous" }
              : entry
          );
          
          return { entries: updatedEntries };
        });
      },
      
      getPlayerEntries: (playerId: string) => {
        return get().entries.filter(entry => entry.playerId === playerId);
      },
      
      getPlayerBestScore: (playerId: string) => {
        const playerEntries = get().entries.filter(entry => entry.playerId === playerId);
        return playerEntries.length > 0 ? Math.max(...playerEntries.map(entry => entry.score)) : 0;
      },
      
      getTopEntries: (limit = 10) => {
        return get().entries.slice(0, limit);
      },
      
      getRank: (score: number) => {
        const entries = get().entries;
        const rank = entries.filter(entry => entry.score > score).length + 1;
        return rank;
      },
      
      clearLeaderboard: () => {
        set({ entries: [] });
      },
    }),
    {
      name: "snake-leaderboard",
    }
  )
);
