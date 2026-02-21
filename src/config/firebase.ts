import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD0vDf1vAaU51HQ0F5dlW48XsHYOkSQpQk",
  authDomain: "medrelief-fe0d1.firebaseapp.com",
  projectId: "medrelief-fe0d1",
  appId: "1:151958773980:web:3c857ad816b7eddb809419",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
