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
  const { firstName, lastName, email, password } = req.body;

  if (typeof firstName === 'string' && firstName.trim().length > 0 &&
  typeof lastName === 'string' && lastName.trim().length > 0 &&
  typeof email === 'string' && email.trim().length > 0 &&
  typeof password === 'string' && password.trim().length > 0
  ) {
      try {
        const existingUser = await User.findOne({ email: email.trim() });
        if (existingUser) {
          return res.status(400).json({ error: 'Email already in use' });
        }
          const user = new User({
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: helpers.hash(password),
          });

          await user.save();
          res.status(200).json({ message: 'User created successfully' });
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Could not create the user' });
      }
  } else {
      res.status(400).json({ error: 'Missing required fields' });
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