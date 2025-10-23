import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnuVSyb43YTpGfmjSyi1ehbgc9V9QsyK0",
  authDomain: "scoop-nation.firebaseapp.com",
  databaseURL: "https://scoop-nation-default-rtdb.firebaseio.com",
  projectId: "scoop-nation",
  storageBucket: "scoop-nation.firebasestorage.app",
  messagingSenderId: "104622400703",
  appId: "1:104622400703:web:14eef46b7f3335903cd20a",
  measurementId: "G-Q4V5RFHY4M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
