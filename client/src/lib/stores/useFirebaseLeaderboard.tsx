import { create } from "zustand";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase";
import type { LeaderboardEntry } from "../../types/snake";

interface FirebaseLeaderboardState {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadLeaderboard: () => Promise<void>;
  addEntry: (playerId: string, playerName: string, score: number, length: number, ipAddress: string) => Promise<LeaderboardEntry>;
  updatePlayerName: (playerId: string, newName: string) => Promise<void>;
  getTopEntries: (limit?: number) => LeaderboardEntry[];
  getPlayerEntries: (playerId: string) => LeaderboardEntry[];
  getPlayerBestScore: (playerId: string) => number;
  getRank: (score: number) => number;
  subscribeToLeaderboard: () => () => void;
}

export const useFirebaseLeaderboard = create<FirebaseLeaderboardState>((set, get) => ({
  entries: [],
  loading: false,
  error: null,
  
  loadLeaderboard: async () => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, "leaderboard"), 
        orderBy("score", "desc"), 
        limit(100)
      );
      const querySnapshot = await getDocs(q);
      
      const entries: LeaderboardEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          playerId: data.playerId,
          playerName: data.playerName,
          score: data.score,
          length: data.length,
          timestamp: data.timestamp?.toMillis() || Date.now(),
        });
      });
      
      set({ entries, loading: false });
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      set({ error: "Erreur lors du chargement du classement", loading: false });
    }
  },
  
  addEntry: async (playerId: string, playerName: string, score: number, length: number, ipAddress: string) => {
    try {
      // Check existing entries for this player
      const existingPlayerEntries = get().entries.filter(entry => entry.playerId === playerId);
      const playerBestScore = existingPlayerEntries.length > 0 
        ? Math.max(...existingPlayerEntries.map(entry => entry.score)) 
        : 0;
      
      // If new score is better, delete all previous scores for this player
      if (score > playerBestScore && existingPlayerEntries.length > 0) {
        const deletePromises = existingPlayerEntries.map(entry => 
          deleteDoc(doc(db, "leaderboard", entry.id))
        );
        await Promise.all(deletePromises);
      }
      
      // Add new entry
      const newEntryData = {
        playerId,
        playerName: playerName.trim() || "Anonymous",
        score,
        length,
        ipAddress,
        timestamp: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "leaderboard"), newEntryData);
      
      const newEntry: LeaderboardEntry = {
        id: docRef.id,
        playerId,
        playerName: playerName.trim() || "Anonymous",
        score,
        length,
        timestamp: Date.now(),
      };
      
      // Reload leaderboard to get updated data
      await get().loadLeaderboard();
      
      return newEntry;
    } catch (error) {
      console.error("Error adding entry:", error);
      throw new Error("Erreur lors de l'ajout du score");
    }
  },
  
  updatePlayerName: async (playerId: string, newName: string) => {
    try {
      const q = query(collection(db, "leaderboard"), where("playerId", "==", playerId));
      const querySnapshot = await getDocs(q);
      
      const updatePromises = querySnapshot.docs.map(docSnapshot => 
        updateDoc(doc(db, "leaderboard", docSnapshot.id), {
          playerName: newName.trim() || "Anonymous"
        })
      );
      
      await Promise.all(updatePromises);
      
      // Update local state
      set((state) => ({
        entries: state.entries.map(entry => 
          entry.playerId === playerId 
            ? { ...entry, playerName: newName.trim() || "Anonymous" }
            : entry
        )
      }));
    } catch (error) {
      console.error("Error updating player name:", error);
      throw new Error("Erreur lors de la mise à jour du pseudo");
    }
  },
  
  getTopEntries: (limitCount = 10) => {
    return get().entries.slice(0, limitCount);
  },
  
  getPlayerEntries: (playerId: string) => {
    return get().entries.filter(entry => entry.playerId === playerId);
  },
  
  getPlayerBestScore: (playerId: string) => {
    const playerEntries = get().entries.filter(entry => entry.playerId === playerId);
    return playerEntries.length > 0 ? Math.max(...playerEntries.map(entry => entry.score)) : 0;
  },
  
  getRank: (score: number) => {
    const entries = get().entries;
    const rank = entries.filter(entry => entry.score > score).length + 1;
    return rank;
  },
  
  subscribeToLeaderboard: () => {
    const q = query(
      collection(db, "leaderboard"), 
      orderBy("score", "desc"), 
      limit(100)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entries: LeaderboardEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          playerId: data.playerId,
          playerName: data.playerName,
          score: data.score,
          length: data.length,
          timestamp: data.timestamp?.toMillis() || Date.now(),
        });
      });
      
      set({ entries, loading: false });
    }, (error) => {
      console.error("Error in leaderboard subscription:", error);
      set({ error: "Erreur de connexion au classement", loading: false });
    });
    
    return unsubscribe;
  },
}));