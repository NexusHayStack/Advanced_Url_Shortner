/*
 * 
 *
 * Request Handler
 * 
 * 
*/


// Instantiate the handler

const handlers = {};

// Ping Handler
handlers.ping = function(data,callback){
  callback(200);
};

handlers.notFound = function(data,callback){
  callback(404);
};