/*
 * Helpers for various tasks
 *
*/

import dotenv from "dotenv";
dotenv.config();

import Url from '../models/Url.js';


var helpers = {};

helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
		var hash = crypto.createHmac('sha256',hashingSecret).update(str).digest('hex');
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

// URL validation logic
helpers.validateUrl = (url) => {
  const regex = /^(https?:\/\/)?([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
  return regex.test(url);
};

// Helper function to handle updates for osType and deviceType
helpers.updateArray = (array, key, keyValue, userId) => {
  const index = array.findIndex((item) => item[key] === keyValue);
  if (index >= 0) {
    // Update existing entry
    if (!array[index].uniqueUsers.includes(userId)) {
      array[index].uniqueUsers.push(userId);
      array[index].uniqueClicks++;
    }
  } else {
    // Add new entry
    array.push({
      [key]: keyValue,
      uniqueUsers: [userId],
      uniqueClicks: 1, // Start with one click for the new entry
    });
  }
}

export default helpers;