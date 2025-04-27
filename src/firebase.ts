//firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_APIKEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.FIREBASE_DB_URL,
  projectId: "messagessharing-a8a0a",
  storageBucket: "messagessharing-a8a0a.firebasestorage.app",
  messagingSenderId: "496386936553",
  appId: "1:496386936553:web:6f939f6ada5f94ec356a78",
  measurementId: "G-XSG6BQBEZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);