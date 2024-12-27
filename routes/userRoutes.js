const express = require("express");
const Users = require('../models/Users');
const router = express.Router();
const handlers = require("../lib/handlers.js");
const authMiddleware = require('../middleware/authMiddleware'); // Path to your auth middleware

// Public Route
router.post("/signup", handlers.createUser);

// Secure Routes
router.get('/:id', authMiddleware, handlers.getUser);
// Update a User
router.put("/:id", authMiddleware, handlers.updateUser);
// Delete User
router.delete("/:id", authMiddleware, handlers.deleteUser);


module.exports = router;