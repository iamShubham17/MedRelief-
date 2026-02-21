import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD0vDf1vAaU51HQ0F5dlW48XsHYOkSQpQk",
  authDomain: "medrelief-fe0d1.firebaseapp.com",
  projectId: "medrelief-fe0d1",
  storageBucket: "medrelief-fe0d1.firebasestorage.app",
  messagingSenderId: "151958773980",
  appId: "1:151958773980:web:3c857ad816b7eddb809419",
  measurementId: "G-B5WL9YR1MP",
  databaseURL: "https://medrelief-fe0d1.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
