import express from "express";
const router = express.Router();
import handlers from '../lib/handlers.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Path to your auth middleware

// Public Route
router.post("/", authMiddleware, handlers.shortenUrl);

/*
// Secure Routes
router.get('/:alias', authMiddleware, handlers.getUrlByAlias);
*/

export default router;