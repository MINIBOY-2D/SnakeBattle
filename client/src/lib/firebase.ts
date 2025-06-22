import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyANUNaDOC-3sDMfGWWVnCcgMWBQZ3hM-Pc",
  authDomain: "snake-ranked.firebaseapp.com",
  projectId: "snake-ranked",
  storageBucket: "snake-ranked.firebasestorage.app",
  messagingSenderId: "329939855976",
  appId: "1:329939855976:web:75d4624ace4052264529dd",
  measurementId: "G-RM237BK10Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;