import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {getMessaging} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBODBspxsmSisaUAzvJRoEmt0SZOHr8eKc",
  authDomain: "clone-10747.firebaseapp.com",
  projectId: "clone-10747",
  storageBucket: "clone-10747.appspot.com",
  messagingSenderId: "310914693517",
  appId: "1:310914693517:web:bde7feeae3a48d2cc4e5c4",
  measurementId: "G-L5YBT0G9CH"
};

const app = initializeApp(firebaseConfig);

const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export default messaging;
export const firebaseAuth = getAuth(app);

