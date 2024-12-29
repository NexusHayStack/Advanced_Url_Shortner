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
    const updates = req.body;

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
    console.error(err);
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
      console.log("Error fetching the specific url: ",url);
      return res.status(404).json({error: 'URL Not Found'});
    }
    
    // Total Clicks
    url.totalClicks = (url.totalClicks || 0) + 1;

    const today = new Date(); // Today's date as a Date object

    // Check if there is an entry for today in the clickedByDate array
    const dateEntryIndex = url.clickedByDate.findIndex(entry => 
      new Date(entry.date).toDateString() === today.toDateString()
    );

    if (dateEntryIndex !== -1) {
      // If today's entry exists, increment the click count
      url.clickedByDate[dateEntryIndex].clicks++;
    } else {
      // If no entry exists for today, add a new one
      url.clickedByDate.push({ date: today, clicks: 1 });
    }



    const urlCreatorId  = url.userId;

    // Fetch the creator of the URL (full user document)
    const urlCreator = await User.findOne({ firebaseUid: urlCreatorId });
    if (!urlCreator) {
      return res.status(404).json({ error: 'URL Creator Not Found' });
    }

    const topic = url.topic || 'Default';

    // Ensure uniqueUsersByTopic has at least one object
    if (urlCreator.uniqueUsersByTopic.length === 0) {
      urlCreator.uniqueUsersByTopic.push({ users: [], clicks: 0 });
    }

    // Access the first object safely
    const topicEntry = urlCreator.uniqueUsersByTopic[0];

    // Ensure `users` array exists and check for userId
    if (!topicEntry.users.includes(userId)) {
      topicEntry.users.push(userId);
      topicEntry.topic = topic;   // Overwrites but works
      topicEntry.clicks++;
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
    console.log("Error while fetching the URL - ERROR: ", err);
    return res.status(500).json({error: 'Could not Fetch the URL'})
  }
}

// Handler for retreiving Analytics
handlers.getAnalyticsByAlias = async function(req, res){
  try {
    const { alias } = req.params;

    const url = await Url.findOne({ customAlias: alias });
    if(!url){
      return res.status(404).json({error: 'URL Not Found'});
    }

    const totalClicks = url.totalClicks;
    const uniqueUsers = url.uniqueUsers.length;
    const clickedByDate = url.clickedByDate;
    const osType = url.osType.map(os => ({
      osName: os.osName,
      uniqueClicks: os.uniqueClicks,
      uniqueUsers: os.uniqueUsers.length,
    }));
    
    const deviceType = url.deviceType.map(device => ({
      deviceName: device.deviceType,
      uniqueClicks: device.uniqueClicks,
      uniqueUsers: device.uniqueUsers.length,
    }));

    const analytics = {
      totalClicks,
      uniqueUsers,
      clickedByDate,
      osType,
      deviceType,
    };

    res.status(200).json(analytics);
  } catch (err) {
    console.log("Error while trying to fetch Analytics - Error: ", err);
    return res.status(500).json({error: 'Could not Fetch the Analytics'})
  }


}


// Handler for retrieving Analytics By Topic
handlers.getAnalyticsByTopic = async function (req, res) {
  try {
    
    const { topic } = req.params;

    // Find all URLs for the topic
    const urls = await Url.find({ topic });
    
    let totalClicks = 0;
    let uniqueUsers = 0;

    // Ensure urls is an array
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(404).json({ error: "No URLs found for the topic." });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid })
    // Aggregate unique users by topic
    console.log("req.user.uniqueUsersByTopic:", user.uniqueUsersByTopic);

    user.uniqueUsersByTopic = (user && user.uniqueUsersByTopic) || [];
    const topicData = user.uniqueUsersByTopic.find((t) => t.topic === topic);

    console.log("topicData:", topicData);

    uniqueUsers += (topicData?.clicks || 0); // Use optional chaining with a fallback

    const clicksByDate = {};
    const urlDetails = [];

    for (const url of urls) {
      if (url.userId === req.user.uid) { // Use strict equality for comparison
        // Aggregate total clicks
        totalClicks += url.totalClicks || 0; // Add a fallback for totalClicks

        // Aggregate clicks by date
        url.clickedByDate.forEach((clickData) => {
          const date = new Date(clickData.date).toISOString().split('T')[0]; // Format to YYYY-MM-DD
          clicksByDate[date] = (clicksByDate[date] || 0) + clickData.clicks;
        });

        // Add URL details
        urlDetails.push({
          shortUrl: url.shortUrl,
          totalClicks: url.totalClicks,
          uniqueUsers: url.uniqueUsers.length,
        });
      }
    }


    // Prepare response
    const analytics = {
      totalClicks,
      uniqueUsers,
      clicksByDate: Object.entries(clicksByDate).map(([date, clicks]) => ({ date, clicks })),
      urls: urlDetails,
    };

    // Send response
    res.status(200).json(analytics);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch the analytics.' });
  }
};

handlers.getAnalytics = async function (req, res) {
  try {
    console.log("Inside getAnalytics")
    const userId = req.user.uid;
    console.log("User ID:", userId);

    // Find all URLs for the User
    const urls = await Url.find({ userId: userId });
    console.log("URLs found:", urls);

    if (!urls || urls.length === 0) {
      return res.status(404).json({ error: 'No URLs found for the specified User.' });
    }

    let totalUrls = urls.length;

    let totalClicks = 0;

    // Aggregate unique users
    let uniqueUsers = uniqueUsers + req.user.uniqueUsers.length || 0;    
    const clicksByDate = {};


    for (const url of urls) {
      // Aggregate total clicks
      totalClicks += url.totalClicks;


      // Aggregate clicks by date
      url.clickedByDate.forEach(clickData => {
        const date = new Date(clickData.date).toISOString().split('T')[0]; // Format to YYYY-MM-DD
        clicksByDate[date] = (clicksByDate[date] || 0) + clickData.clicks;
      });

      const osType = url.osType.map(os => ({
        osName: os.osName,
        uniqueClicks: os.uniqueClicks,
        uniqueUsers: os.uniqueUsers.length,
      }));
      
      const deviceType = url.deviceType.map(device => ({
        deviceName: device.deviceType,
        uniqueClicks: device.uniqueClicks,
        uniqueUsers: device.uniqueUsers.length,
      }));
    }

    // Prepare response
    const analytics = {
      totalUrls,
      totalClicks,
      uniqueUsers,
      clicksByDate: Object.entries(clicksByDate).map(([date, clicks]) => ({ date, clicks })),
      osType,
      deviceType,
    };
    console.log("Sending response:", analytics);

    // Send response
    res.status(200).json(analytics);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch the analytics.' });
  }
}

export default handlers;