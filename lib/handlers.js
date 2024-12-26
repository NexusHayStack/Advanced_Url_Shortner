/*
 * 
 *
 * Request Handler
 * 
 * 
*/


// Instantiate the handler

const handlers = {};
const User = require('../models/Users');
const helpers = require('./helpers');

// Creat a new User
handlers.createUser = async function (req, res) {

  // Check that all required fields are filled out
  const { firebaseUid, email, displayName} = req.body;

  if (typeof firebaseUid === 'string' && firebaseUid.trim().length > 0 &&
  typeof displayName === 'string' && displayName.trim().length > 0 &&
  typeof email === 'string' && email.trim().length > 0 /* &&
  createdAt instanceof Date && createdAt > Date.now() &&
  updatedAt instanceof Date && updatedAt > Date.now() */
  ) {
      try {
        const existingUser = await User.findOne({ email: email.trim() });
        if (existingUser) {
          return res.status(400).json({ error: 'Email already in use' });
        }
          const user = new User({
              firebaseUid: firebaseUid,
              email: email,
              displayName: displayName,
              createdAt: Date.now(),
              updatedAt: Date.now(),
          });

          await user.save();
          return res.status(200).json({ message: 'User created successfully' });
      } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Could not create the user' });
      }
  } else {
      return res.status(400).json({ error: 'Missing required fields' });
  }
};

// Get User Data
handlers.getUser = async function (req, res) {
  try {
  const id = req.params;
  const user = await User.findById(id);
  if(!user){
    res.status(404).json({error: 'User Not Found'});
  }
  res.status(200).json(user);
  } catch (err) {
    res.status(500).json({error: 'Could not Fetch the User'})
  }
};

// Ping Handler
handlers.ping = function(req,res){
  res.status(200).json({message: 'pong'});
};

handlers.notFound = function(req,res){
  res.status(404).json({message: 'Not Found'});
};


module.exports = handlers;