import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true }, // Reference to User
  longUrl: { type: String, required: true },
  customAlias: {type: String, required: false},
  topic: {type: String, required: false},
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Url', UrlSchema);
