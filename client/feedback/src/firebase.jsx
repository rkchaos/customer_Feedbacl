// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYDiYs-pNDuCTdYYB2ZA76IYqRs1wQLNQ",
  authDomain: "auth-dcfaa.firebaseapp.com",
  projectId: "auth-dcfaa",
  storageBucket: "auth-dcfaa.firebasestorage.app",
  messagingSenderId: "348131138024",
  appId: "1:348131138024:web:429aec419b1c9eb6b2ec5d",
  measurementId: "G-WYX4QEQTCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)