/*
 * Helpers for various tasks
 *
*/

const crypto = require('crypto');
require('dotenv').config();

var helpers = {};

helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
		var hash = crypto.createHmac('sha256',process.env.hashingSecret).update(str).digest('hex');
		return hash;
	} else{
		return false;
	}
}

// Parse a JSON string to an object in all cases, without throwing up
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e) {
    return {};
  }
};


module.exports = helpers;