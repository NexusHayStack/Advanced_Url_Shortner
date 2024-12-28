import express from "express";
const router = express.Router();
import handlers from '../lib/handlers.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Path to your auth middleware

import rateLimiter from "../middleware/rateLimiter.js";

// Limit to 100 requests per 15 minutes
const limiter = rateLimiter(100, 15 * 60);

// Secure Route
router.post("/", authMiddleware, limiter, handlers.shortenUrl);

router.get('/:alias', authMiddleware, handlers.getUrlByAlias);

export default router;