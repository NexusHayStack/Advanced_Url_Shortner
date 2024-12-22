const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swagger-config');

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('inspector');
const StringDecoder = require('string_decoder');
const handlers = require('./handlers')


// Instantiate the server module object
const server = express();

// Serve Swagger API Docs
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

// All the serve logic
server.unifiedServer = function(req,res){
  // Get the requested Url
    // true indicates the parse function to also include the query string in the parsedUrl
  var parsedUrl = url.parse(req.url,true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the string query as an object
  var querystringObject = parsedUrl.query;

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Get the headers as an objec
  var headers = req.headers;

  // Get the payload, if any
    // decoder object to decode utf-8 to string
  var decoder = new StringDecoder('utf-8')
  var buffer = '';

    /* takes the 'data', when 'data' event is emitted by the 'req' object, and plug it in a call back function */
  req.on('data',function(){
      // appending each data to the buffer bit-by-bit
    buffer += decoder.write(data);
  });

  // Stop the request-binding on the end of the stream
  req.on('end',function(){
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found use the notFound handler.
    var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': querystringObject,
      'method': method,
      'headers': headers,
      'data': helpers.parseJsonToObject(buffer)
    }

    // Route the request to the handler specified in the router 
    chosenHandler(data,function(statusCode,payload){
      // Use the status code returned by the handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload returned by the handler or default to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Conver the payload to a string
      var payloadString = JSON.stringify(payload);

      // Send the response 
        // Sending a 'Header Content = json', telling the client browser that server is sending a json type
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the requested payload
      console.log(trimmedPath,statusCode);

      // Log the requested path 
      // If the status code is 200 print in green else red
      if(statusCode == 200){
        console.log('\x1b[32m%s\x1b[0m','Returning this response: '+method.toUpperCase()+ ' /'+trimmedPath+' '+statusCode,payloadString);
      }else {
        console.log('\x1b[31m%s\x1b[0m','Returning this response: '+method.toUpperCase()+ ' /'+trimmedPath+' '+statusCode,payloadString);
      }
    });
  });
};

server.router = {
  'ping': handlers.ping
}

// Init Script
server.init = function () {

  server.httpServer.listen(5000, () => {
    console.log("App is listening on port: 5000");
  });

  server.httpsServer.listen(5001, () => {
    console.log("App is listening on port: 5001");
  });
}



module.exports = server;