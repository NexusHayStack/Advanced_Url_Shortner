import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true }, // Reference to User
  longUrl: { type: String, required: true },
  customAlias: {type: String, required: false},
  topic: {type: String, required: false},
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  totalClicks: { type: Number, required: false},
  uniqueUsers: { type: [String], required: false},
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

export default mongoose.model('Url', UrlSchema);
