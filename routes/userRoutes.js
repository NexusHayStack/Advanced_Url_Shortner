import express from "express";
import Users from '../models/Users.js';
const router = express.Router();
import handlers from '../lib/handlers.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Path to your auth middleware

// Public Route
router.post("/signup", handlers.createUser);

// Secure Routes
router.get('/:id', authMiddleware, handlers.getUser);
// Update a User
router.put("/:id", authMiddleware, handlers.updateUser);
// Delete User
router.delete("/:id", authMiddleware, handlers.deleteUser);


export default router;