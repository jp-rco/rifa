import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAu9brVxjX5DEQst6kxjpUlCam1TapdYe4",
  authDomain: "rifa-253be.firebaseapp.com",
  projectId: "rifa-253be",
  storageBucket: "rifa-253be.firebasestorage.app",
  messagingSenderId: "64017755873",
  appId: "1:64017755873:web:753b5febf38920d4bad1a0",
  measurementId: "G-GQ2JC6MM8G",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
