// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAh9lsDhop9N_0pcFgRjykB5zBxrXDQkwE",
  authDomain: "eco-snap-e19d9.firebaseapp.com",
  projectId: "eco-snap-e19d9",
  storageBucket: "eco-snap-e19d9.firebasestorage.app",
  messagingSenderId: "1058163703822",
  appId: "1:1058163703822:web:5ed0e3d0c20e01d1b0bc5f",
  measurementId: "G-X4T0Y36G21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };
export { db };