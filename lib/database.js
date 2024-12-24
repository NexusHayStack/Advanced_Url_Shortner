
const mongoose = require('mongoose');


// Connect to MongoDB
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sciencegeek057:xtOVutkf5lSYkUA5@urlcluster.v2kxy.mongodb.net/Node-API?retryWrites=true&w=majority&appName=UrlCluster")
    .then(() => {
        console.log('Connected to database!')
    })
    
    .catch(() => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit with failure
    });
    
};

module.exports = connectDB;