import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerState {
  playerId: string | null;
  playerName: string | null;
  
  // Actions
  setPlayer: (name: string) => string;
  updatePlayerName: (newName: string) => void;
  getPlayer: () => { id: string; name: string } | null;
  clearPlayer: () => void;
}

// Generate a unique player ID
const generatePlayerId = () => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      playerId: null,
      playerName: null,
      
      setPlayer: (name: string) => {
        const state = get();
        const trimmedName = name.trim();
        
        if (!trimmedName) return state.playerId || generatePlayerId();
        
        // If player already exists, just update the name
        if (state.playerId && state.playerName) {
          set({ playerName: trimmedName });
          return state.playerId;
        }
        
        // Create new player
        const newPlayerId = generatePlayerId();
        set({
          playerId: newPlayerId,
          playerName: trimmedName,
        });
        
        return newPlayerId;
      },
      
      updatePlayerName: (newName: string) => {
        const state = get();
        const trimmedName = newName.trim();
        
        if (!trimmedName || !state.playerId) return;
        
        set({ playerName: trimmedName });
      },
      
      getPlayer: () => {
        const state = get();
        if (state.playerId && state.playerName) {
          return {
            id: state.playerId,
            name: state.playerName,
          };
        }
        return null;
      },
      
      clearPlayer: () => {
        set({
          playerId: null,
          playerName: null,
        });
      },
    }),
    {
      name: "snake-player",
    }
  )
);