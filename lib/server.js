const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swagger-config');

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./handlers')


// Instantiate the server module object
const server = express();

// Middleware to parse JSON body
server.use(express.json());

// Serve Swagger API Docs
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
server.get('/ping',handlers.ping);


// Instantiate the HTTPS Server
httpsServerOptions = {
  'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
  'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};
server.init = function(){
  http.createServer(server).listen(5000, () => {
    console.log("App is listening on port: 5000");
  });
  
  https.createServer(httpsServerOptions,server).listen(5001, () => {
    console.log("App is listening on port: 5001");
  });
}





module.exports = server;