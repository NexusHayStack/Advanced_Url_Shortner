// Ensure DOTENV is loaded first
import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";
import fs from "fs";  // Import fs module to read file
import path from "path"; // Optional: Useful for resolving absolute paths

// Initialize Firebase Admin SDK
const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Token Verification Function
export const verifyToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded Token:", decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Unauthorized");
  }
};

// Named Export for `admin`
export { admin };
