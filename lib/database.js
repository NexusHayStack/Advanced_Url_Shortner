require('dotenv').config();

const mongoose = require('mongoose');

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

module.exports = connectDB;