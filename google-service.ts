// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH7Vow9Gz3fbbHUgSgJflOcUXVjsPUGEs",
  authDomain: "jawad-b4fcd.firebaseapp.com",
  projectId: "jawad-b4fcd",
  storageBucket: "jawad-b4fcd.firebasestorage.app",
  messagingSenderId: "403366748330",
  appId: "1:403366748330:web:42d2cdaaa8bad0fee5b0d3",
  measurementId: "G-2NWR8F73Q1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);