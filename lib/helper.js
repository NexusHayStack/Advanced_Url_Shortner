/*
 * Helpers for various tasks
 *
*/

// Parse a JSON string to an object in all cases, without throwing up
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e) {
    return {};
  }
};