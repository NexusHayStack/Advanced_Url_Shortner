// Import Firebase SDK for browsers using ES modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// Firebase configuration (move these safely to the frontend; no need for dotenv in the browser)
const firebaseConfig = {
    apiKey:"AIzaSyC2TNEbsBW60lrXDhVViTQaGWNC-DKIVdE",
    authDomain:"advancedurlshortner.firebaseapp.com",
    projectId:"advancedurlshortner",
    storageBucket:"advancedurlshortner.firebasestorage.app",
    messagingSenderId:"983185261472",
    appId:"1:983185261472:web:629f6f8a3501377a069ac5",
    measurementId: "G-BF0RLT7X37"
};

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
console.log("Firebase initialized.");

// Function to handle Google Sign-In
async function googleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    console.log("ID Token:", idToken);

    // Send idToken to backend
    const response = await fetch("https://localhost:5001/api/user/signup", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+idToken
      },
      
    });

  const data = await response.json();
  console.log("Backend response:", data);
  alert(`Welcome ${data.name || "user"}!`);  } catch (error) {
    console.error("Sign-In Error:", error);
    alert("Error signing in: " + error.message);
  }
}

// Attach event listener to the button
document.getElementById("googleSignInBtn").addEventListener("click", googleSignIn);
