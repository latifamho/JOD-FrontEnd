import { getApp, getApps, initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyBH7Vow9Gz3fbbHUgSgJflOcUXVjsPUGEs",
  authDomain: "jawad-b4fcd.firebaseapp.com",
  projectId: "jawad-b4fcd",
  storageBucket: "jawad-b4fcd.firebasestorage.app",
  messagingSenderId: "403366748330",
  appId: "1:403366748330:web:42d2cdaaa8bad0fee5b0d3",
  measurementId: "G-2NWR8F73Q1",
} as const;

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
