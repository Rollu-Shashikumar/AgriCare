import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAXnehAV_mINxxVOa3RwoIH_LQs_oOYeyo",
  authDomain: "agricare-a4864.firebaseapp.com",
  projectId: "agricare-a4864",
  storageBucket: "agricare-a4864.firebasestorage.app",
  messagingSenderId: "776203751402",
  appId: "1:776203751402:web:983f44178a129be4486c93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
