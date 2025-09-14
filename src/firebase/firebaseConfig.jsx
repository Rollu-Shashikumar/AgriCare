import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCYXXAXBPgBG-2ULXPopYsN6vj6MAj4HWM",
  authDomain: "agricare-870c3.firebaseapp.com",
  projectId: "agricare-870c3",
  storageBucket: "agricare-870c3.firebasestorage.app",
  messagingSenderId: "46644581886",
  appId: "1:46644581886:web:2056a6d00d93e685d39caf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
