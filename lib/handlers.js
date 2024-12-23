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
handlers.ping = function(req,res){
  res.status(200).json({message: 'pong'});
};

handlers.notFound = function(req,res){
  res.status(404).json({message: 'Not Found'});
};


module.exports = handlers;