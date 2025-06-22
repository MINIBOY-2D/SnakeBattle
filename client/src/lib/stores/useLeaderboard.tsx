import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LeaderboardEntry } from "../../types/snake";

interface LeaderboardState {
  entries: LeaderboardEntry[];
  
  // Actions
  addEntry: (playerName: string, score: number, length: number) => LeaderboardEntry;
  getTopEntries: (limit?: number) => LeaderboardEntry[];
  getRank: (score: number) => number;
  clearLeaderboard: () => void;
}

export const useLeaderboard = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      entries: [],
      
      addEntry: (playerName: string, score: number, length: number) => {
        const newEntry: LeaderboardEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          playerName: playerName.trim() || "Anonymous",
          score,
          length,
          timestamp: Date.now(),
        };
        
        set((state) => {
          const newEntries = [...state.entries, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 100); // Keep top 100 entries
          
          return { entries: newEntries };
        });
        
        return newEntry;
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
