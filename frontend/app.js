// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2TNEbsBW60lrXDhVViTQaGWNC-DKIVdE",
  authDomain: "advancedurlshortner.firebaseapp.com",
  projectId: "advancedurlshortner",
  storageBucket: "advancedurlshortner.firebasestorage.app",
  messagingSenderId: "983185261472",
  appId: "1:983185261472:web:629f6f8a3501377a069ac5",
  measurementId: "G-BF0RLT7X37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);