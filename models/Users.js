import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // Google user ID
  email: { type: String, required: true, unique: true },       // User's email
  displayName: { type: String, required: false },              // User's display name
  createdAt: { type: Date, default: Date.now },                // Account creation date
  updatedAt: { type: Date, default: Date.now },                // Last update date
});

export default mongoose.model('User', UserSchema);