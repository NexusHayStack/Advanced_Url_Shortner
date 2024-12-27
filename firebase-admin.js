// **DOTENV IMPORT SHOULD ALWAYS BE AT TOP!!!!
require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY); // Replace with your actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-firebase-project-id.firebaseio.com', // Replace with your project ID
});

// Verify ID Token function to ensure user authentication
const verifyToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Decoded Token:', decodedToken); // Contains user info
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Unauthorized');
  }
};

// Export both `admin` and `verifyToken` properly
module.exports = {
  admin,
  verifyToken,
};
