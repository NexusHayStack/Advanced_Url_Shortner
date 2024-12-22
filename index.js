const express = require('express')
var server = require('./lib/server');
const app = express();



app.init = function(){

  // Start the server
  server.init();
}

// Execute
app.init();


// Export this app
module.exports = app;

