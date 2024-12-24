const express = require('express')
var server = require('./lib/server');
const connectDB = require('./lib/database');
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
module.exports = app;

