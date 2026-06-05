// @ts-ignore
import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-ignore
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKdxq8aYHoGyEfk3s0esIN98NZnKjFKeU",
  authDomain: "campusos-e629d.firebaseapp.com",
  projectId: "campusos-e629d",
  storageBucket: "campusos-e629d.firebasestorage.app",
  messagingSenderId: "704562428466",
  appId: "1:704562428466:web:8767b58d5603312289da2b",
  measurementId: "G-WPNV6K9S7S"
};

// Initialize Firebase (singleton pattern for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
