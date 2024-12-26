const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swagger-config');

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const handlers = require('./handlers');

// Import Routes
const userRoutes = require('../routes/userRoutes');


// Instantiate the server module object
const server = express();

// Import CORS (for headers)
const cors = require('cors');

// Use CORS middleware to allow requests from your frontend
server.use(cors({
  origin: 'http://127.0.0.1:8080', // Replace with the origin of your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));



// Middleware to parse JSON body
server.use(express.json());

// Serve Swagger API Docs
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
server.get('/ping',handlers.ping);

server.use('/api/user',userRoutes);

server.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


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