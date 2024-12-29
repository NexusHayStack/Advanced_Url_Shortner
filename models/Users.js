import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // Google user ID
  email: { type: String, required: true, unique: true },       // User's email
  displayName: { type: String, required: false },              // User's display name
  createdAt: { type: Date, default: Date.now },                // Account creation date
  updatedAt: { type: Date, default: Date.now },                // Last update date
  uniqueUsers: { type: [String], required: false},             // Number of Clicks by unique users
  osType: [
    {
      osName: { type: String, required: false }, // Name of the OS
      uniqueClicks: { type: Number, default: 0 }, // Count of unique clicks for this OS
      uniqueUsers: { type: [String], required: false }, // Array of user IDs
    },
  ],
  deviceType: [
    {
      deviceType: { type: String, required: false }, // Device Type
      uniqueClicks: { type: Number, default: 0 }, // Count of unique clicks for this Device
      uniqueUsers: { type: [String], required: false }, // Array of user IDs
    },
  ],
});

export default mongoose.model('User', UserSchema);