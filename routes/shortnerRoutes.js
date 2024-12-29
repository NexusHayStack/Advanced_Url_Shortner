import express from "express";
const router = express.Router();
import handlers from '../lib/handlers.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Path to your auth middleware

import rateLimiter from "../middleware/rateLimiter.js";

// Limit to 100 requests per 15 minutes
const limiter = rateLimiter(100, 15 * 60);

// Secure Route

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Shorten a URL
 *     tags:
 *       - URL Shortening
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: URL to shorten
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://example.com"
 *     responses:
 *       200:
 *         description: Shortened URL successfully created.
 *       400:
 *         description: Invalid input.
 */
router.post("/", authMiddleware, limiter, handlers.shortenUrl);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Get a URL by alias
 *     tags:
 *       - URL Shortening
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The alias of the URL.
 *     responses:
 *       200:
 *         description: URL retrieved successfully.
 *       404:
 *         description: URL not found.
 */
router.get('/:alias', authMiddleware, handlers.getUrlByAlias);

export default router;