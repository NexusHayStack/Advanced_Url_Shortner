import express from 'express';
import server from './lib/server.js';
import connectDB from './lib/database.js';
const app = express();


// Initialize database connection
connectDB();

app.init = function(){

  // Start the server
  server.init();
}

// Execute
app.init();


// Export this app
export default app;

