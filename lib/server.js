import express from 'express'
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../swagger-config.js';

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import url from 'url';
import handlers from './handlers.js';

// Import Routes
import userRoutes from '../routes/userRoutes.js';
import urlShortnerRoutes from '../routes/shortnerRoutes.js';

// Get the current directory name
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Instantiate the server module object
const server = express();

// Import CORS (for headers)
import cors from 'cors';

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
  // Routes for handling Users
server.use('/api/user',userRoutes);
  // Routes for handling Url Shortening
server.use('/api/shorten',urlShortnerRoutes);



server.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


// Instantiate the HTTPS Server
server.httpsServerOptions = {
  'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
  'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};
server.init = function(){
  http.createServer(server).listen(5000, () => {
    console.log("App is listening on port: 5000");
  });
  
  https.createServer(server.httpsServerOptions,server).listen(5001, () => {
    console.log("App is listening on port: 5001");
  });
}





export default server;