// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
const apiKey=import.meta.env.VITE_APIKEY
const authDomain=import.meta.env.VITE_AUTHDOMAIN
const storageBucket=import.meta.env.VITE_STORAGEBUCKET
const messageSenderid=import.meta.env.VITE_MESSAGESENDERID
const appId=import.meta.env.VITE_APPID
const measureMent=import.meta.env.VIRE_MEASUREMENTID
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: "auth-dcfaa",
  storageBucket:storageBucket ,
  messagingSenderId: messageSenderid,
  appId: appId,
  measurementId: measureMent
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)