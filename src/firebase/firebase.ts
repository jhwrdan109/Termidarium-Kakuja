import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAUTwgo1f1YWXFJXfmMmyjoVLL8eZea5UY",
  authDomain: "dse-ii-9af1f.firebaseapp.com",
  databaseURL: "https://dse-ii-9af1f-default-rtdb.firebaseio.com",
  projectId: "dse-ii-9af1f",
  storageBucket: "dse-ii-9af1f.firebasestorage.app",
  messagingSenderId: "345521489269",
  appId: "1:345521489269:web:68100be743cf8725c1bf3c",
  measurementId: "G-NQG3N3T59R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);