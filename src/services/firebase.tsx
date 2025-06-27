// /services/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyAC5JZdee_nTxzHewXuiokJa-2wkGZTSBA",

  authDomain: "test-17d72.firebaseapp.com",

  projectId: "test-17d72",

  storageBucket: "test-17d72.firebasestorage.app",

  messagingSenderId: "579550488154",

  appId: "1:579550488154:web:82e02f04adcb7b38539a63",

  measurementId: "G-PJDMM4JKBF"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
