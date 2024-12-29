import express from "express";
const router = express.Router();
import handlers from '../lib/handlers.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Path to your auth middleware

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific alias
 *     tags:
 *       - Analytics
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
 *         description: Analytics retrieved successfully.
 */
router.get('/:alias', authMiddleware, handlers.getAnalyticsByAlias);

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for a specific topic
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The topic to filter analytics.
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully.
 */
router.get('/topic/:topic', authMiddleware, handlers.getAnalyticsByTopic);

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overall analytics retrieved successfully.
 */
router.get('/overall', authMiddleware, handlers.getAnalytics);

export default router;