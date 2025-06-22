import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

interface FirebasePlayerState {
  playerId: string | null;
  playerName: string | null;
  ipAddress: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  initializePlayer: () => Promise<void>;
  createOrGetPlayer: (name: string, ipAddress: string) => Promise<string>;
  updatePlayerName: (newName: string) => Promise<void>;
  getPlayer: () => { id: string; name: string; ip: string } | null;
  clearPlayer: () => void;
}

// Generate a unique player ID
const generatePlayerId = () => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

import { getUserIP } from "../ipDetection";

export const useFirebasePlayer = create<FirebasePlayerState>()(
  persist(
    (set, get) => ({
      playerId: null,
      playerName: null,
      ipAddress: null,
      loading: false,
      error: null,
      
      initializePlayer: async () => {
        set({ loading: true, error: null });
        try {
          const currentIP = await getUserIP();
          set({ ipAddress: currentIP });
          
          // Check if there's already a player for this IP
          const q = query(collection(db, "players"), where("ipAddress", "==", currentIP));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Player exists for this IP
            const playerDoc = querySnapshot.docs[0];
            const playerData = playerDoc.data();
            
            set({
              playerId: playerDoc.id,
              playerName: playerData.playerName,
              loading: false
            });
          } else {
            // No player found for this IP, will create when needed
            set({ loading: false });
          }
        } catch (error) {
          console.error("Error initializing player:", error);
          set({ error: "Erreur lors de l'initialisation du joueur", loading: false });
        }
      },
      
      createOrGetPlayer: async (name: string, ipAddress: string) => {
        const state = get();
        const trimmedName = name.trim();
        
        if (!trimmedName) {
          throw new Error("Le nom ne peut pas être vide");
        }
        
        try {
          // Check if player already exists for this IP
          const q = query(collection(db, "players"), where("ipAddress", "==", ipAddress));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Player exists, update name if different
            const playerDoc = querySnapshot.docs[0];
            const playerData = playerDoc.data();
            
            if (playerData.playerName !== trimmedName) {
              await updateDoc(doc(db, "players", playerDoc.id), {
                playerName: trimmedName,
                lastUpdated: serverTimestamp()
              });
            }
            
            set({
              playerId: playerDoc.id,
              playerName: trimmedName,
            });
            
            return playerDoc.id;
          } else {
            // Create new player
            const newPlayerData = {
              playerName: trimmedName,
              ipAddress,
              createdAt: serverTimestamp(),
              lastUpdated: serverTimestamp()
            };
            
            const docRef = await addDoc(collection(db, "players"), newPlayerData);
            
            set({
              playerId: docRef.id,
              playerName: trimmedName,
            });
            
            return docRef.id;
          }
        } catch (error) {
          console.error("Error creating/getting player:", error);
          throw new Error("Erreur lors de la création du joueur");
        }
      },
      
      updatePlayerName: async (newName: string) => {
        const state = get();
        const trimmedName = newName.trim();
        
        if (!trimmedName || !state.playerId) {
          throw new Error("Nom invalide ou joueur non trouvé");
        }
        
        try {
          await updateDoc(doc(db, "players", state.playerId), {
            playerName: trimmedName,
            lastUpdated: serverTimestamp()
          });
          
          set({ playerName: trimmedName });
        } catch (error) {
          console.error("Error updating player name:", error);
          throw new Error("Erreur lors de la mise à jour du nom");
        }
      },
      
      getPlayer: () => {
        const state = get();
        if (state.playerId && state.playerName && state.ipAddress) {
          return {
            id: state.playerId,
            name: state.playerName,
            ip: state.ipAddress,
          };
        }
        return null;
      },
      
      clearPlayer: () => {
        set({
          playerId: null,
          playerName: null,
          ipAddress: null,
          error: null
        });
      },
    }),
    {
      name: "firebase-snake-player",
      partialize: (state) => ({
        playerId: state.playerId,
        playerName: state.playerName,
        ipAddress: state.ipAddress,
      }),
    }
  )
);