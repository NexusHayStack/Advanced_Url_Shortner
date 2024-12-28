import { config } from "dotenv";

import mongoose from 'mongoose';

// Connect to MongoDB
const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to database!')
    })
    
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit with failure
    });
    
};

export default connectDB;