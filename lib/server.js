const express = require('express')
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');


// Instantiate the server module object
const server = express();


// Instantiate the HTTP Server
server.httpServer = http.createServer(function(req,res){
  server.unifiedServer(req,res);
});

// Instantiate the HTTPS Server
server.httpsServerOptions = {
  'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
  'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions,function(req,res){
  server.unifiedServer(req,res);
});

server.unifiedServer = function(req,res){
  
  res.end("App is running");

};


server.init = function () {
  server.use('/', server.unifiedServer);

  server.httpServer.listen(5000, () => {
    console.log("App is listening on port: 5000");
  });

  server.httpsServer.listen(5001, () => {
    console.log("App is listening on port: 5001");
  });
}



module.exports = server;