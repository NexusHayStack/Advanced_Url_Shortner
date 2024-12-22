const express = require('express')






// Instantiate the server module object
const server = express();



server.init = function () {
  server.use('/',(req,res) => {
    res.send("App is running");
  });
  
  server.listen(5000, () => {
    console.log("App is listening on port: 5000");
  });
}



module.exports = server;