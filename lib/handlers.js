/*
 * 
 *
 * Request Handler
 * 
 * 
*/


// Instantiate the handler

const handlers = {};
const { verifyToken } = require('../firebase-admin');
const User = require('../models/Users');
const helpers = require('./helpers');
const { admin } = require('../firebase-admin');

// Ping Handler
handlers.ping = function(req,res){
  res.status(200).json({message: 'pong'});
};

handlers.notFound = function(req,res){
  res.status(404).json({message: 'Not Found'});
};


// Creat a new User
handlers.createUser = async function (req, res) {

  // Extract token from the Authorization header 
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(400).json({error: 'Unauthorized: Missing or invalid token'});
  }

  const idToken = authHeader.split('Bearer ')[1];

  //@Checking token newline present or not?
  console.log(idToken);

    try {
      
      // Verify Token and extract user info
      const decodedToken = await verifyToken(idToken);
      const firebaseUid = decodedToken.uid;  // Extract uid from Token
      const email = decodedToken.email;
      const displayName = decodedToken.displayName || '';   // Fallback if name is unavailable  

      // Check if user already exists
      const existingUser = await User.findOne({firebaseUid});
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create and save the user
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

};

// Get User Data
handlers.getUser = async function (req, res) {
  try {
  const { id } = req.params;
  const user = await User.findOne({ firebaseUid: id });   // Using findOne() to find user by firebaseUid
  if(!user){
    return res.status(404).json({error: 'User Not Found'});
  }
  res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({error: 'Could not Fetch the User'})
  }
};

handlers.updateUser = async function (req, res) {
  try{
    const { id } = req.params;
    updates = req.body;

    if(!updates || updates._id || updates.firebaseUid || updates.email){
      return res.status(400).json({error: 'Missing or Invalid Fields to Update'})
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: id },    // Filter
      { $set: updates },      // Update operation
      { new: true }           // Return updated document
    );
    if(!user){
      return res.status(404).json({error: 'User Not Found'});
    }

    return res.status(200).json({message: 'User created successfully\n', User: user});
  } catch(err) {
    return res.status(500).json({error: 'Could not Update the User'})
  }
}


handlers.deleteUser = async function (req, res){
try {
  const { id } = req.params;

  // Delete the user from your MongoDB collection
  const user = await User.findOneAndDelete( { firebaseUid: id } );

  if(!user){
    return res.status(404).json({error: 'User Not Found'});
  }

  // Delete the user from Firebase Authentication
  await admin.auth().deleteUser(id); // Delete user by Firebase UID

  return res.status(200).json({message: 'User deleted successfully\n', User: user});
} catch(err) {
  console.error('Error deleting user:', err); // Log the error for debugging
  return res.status(500).json({error: 'Could not Delete the User'})
}

}


module.exports = handlers;