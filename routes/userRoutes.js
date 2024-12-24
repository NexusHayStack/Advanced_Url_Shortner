const express = require("express");
const Users = require('../models/Users');
const router = express.Router();
const handlers = require("../lib/handlers.js");


router.post("/signup", handlers.createUser);

/*router.get("/:id", getUser);

// Update a User
router.put("/:id", updateUser);

router.delete("/:id", deleteUser);
*/

module.exports = router;