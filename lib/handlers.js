/*
 * 
 *
 * Request Handler
 * 
 * 
*/


// Instantiate the handler

const handlers = {};
import { verifyToken } from '../firebase-admin.js';
import User from '../models/Users.js';
import Url from '../models/Url.js';
import helpers from './helpers.js';
import { admin } from '../firebase-admin.js';
import { nanoid } from "nanoid";
import { UAParser } from 'ua-parser-js';

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

    return res.status(200).json({message: 'User updated successfully\n', User: user});
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

handlers.shortenUrl = async function (req, res) {
  try{
    // Extract the authenticated userId from the request
    const userId = req.user.uid;
    
    // Extract url details from the request
    const longUrl = req.body.longUrl;
    const customAlias = req.body.customAlias || '';
    const topic = req.body.topic || '';

    if (!helpers.validateUrl(longUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Check if alias already exists
    if(customAlias){
      const existingAlias = await Url.findOne({customAlias});
      if (existingAlias) {
        return res.status(400).json({ error: 'Custom alias already exists' });
      }
    } else {
      // Generate a random Alias
      let isUnique = false;
      while(!isUnique){       // Keep generating until a unique one is generated
        customAlias = nanoid(5);
        const aliasCheck = await Url.findOne({ customAlias });
        if (!aliasCheck) {
          isUnique = true;
        }
      }
      
    }

    // Generate a Short URL
    const shortUrl = nanoid(7);

    const url = new Url({
      userId: userId,
      longUrl: longUrl,
      customAlias: customAlias,
      topic: topic,
      shortUrl: shortUrl,
      createdAt: Date.now(),
    });
    await url.save();
    return res.status(200).json({ message: 'URL created successfully', Url: url });

  } catch(err) {
    return res.status(500).json({error: 'Could not Create the URL', details: err.message})
  }
}

handlers.getUrlByAlias = async function (req, res) {
  try {
    const { alias } = req.params;
    const userId = req.user.uid;
    const userAgent = req.headers['user-agent'];

    const parser = new UAParser();
    parser.setUA(userAgent);
    const parsedUserAgent = parser.getResult();
    console.log(parsedUserAgent);
    
    const osName = parsedUserAgent.os.name || 'Unknown OS'; // e.g., 'Windows', 'iOS'
    const deviceType = parsedUserAgent.device.type || 'desktop'; // e.g., 'mobile', 'tablet', 'desktop'



    const url = await Url.findOne({ customAlias: alias });
    if(!url){
      return res.status(404).json({error: 'URL Not Found'});
    }
    
    // Total Clicks
    url.totalClicks = (url.totalClicks || 0) + 1;
    console.log(url.totalClicks);

    const urlCreatorId  = url.userId;
    console.log(urlCreatorId);

    // Fetch the creator of the URL (full user document)
    const urlCreator = await User.findOne({ firebaseUid: urlCreatorId });
    if (!urlCreator) {
      return res.status(404).json({ error: 'URL Creator Not Found' });
    }

    // Unique Users for urlCreator
    if (urlCreator) {
      if (!urlCreator.uniqueUsers.includes(userId)) {
        urlCreator.uniqueUsers.push(userId);

        // Update osType and deviceType arrays for the creator
        helpers.updateArray(urlCreator.osType, "osName", osName, userId);
        helpers.updateArray(urlCreator.deviceType, "deviceType", deviceType, userId);
      }
    }

    // Unique Users for URL
    if (!url.uniqueUsers.includes(userId)) {
      url.uniqueUsers.push(userId);

      // Update osType and deviceType arrays for the URL
      helpers.updateArray(url.osType, "osName", osName, userId);
      helpers.updateArray(url.deviceType, "deviceType", deviceType, userId);
    }

    // Save the updated creator document
    await urlCreator.save();

    // Save the updated URL document
    await url.save();

    // Redirect to the long URL
    return res.redirect(url.longUrl);
  } catch (err) {
    return res.status(500).json({error: 'Could not Fetch the URL'})
  }
}

export default handlers;