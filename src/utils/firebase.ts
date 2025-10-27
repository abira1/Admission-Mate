import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4-ab4G2Avr4MzxC5dEAGF67omYLWArgk",
  authDomain: "admission-mate.firebaseapp.com",
  databaseURL: "https://admission-mate-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admission-mate",
  storageBucket: "admission-mate.firebasestorage.app",
  messagingSenderId: "799499223641",
  appId: "1:799499223641:web:a04f9849e4a8c87611a748",
  measurementId: "G-Z08N47GVKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;