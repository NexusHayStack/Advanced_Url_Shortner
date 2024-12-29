import express from "express";
const router = express.Router();
import handlers from '../lib/handlers.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Path to your auth middleware

router.get('/:alias', authMiddleware, handlers.getAnalyticsByAlias);

router.get('/topic/:topic', authMiddleware, handlers.getAnalyticsByTopic);

router.get('/overall', authMiddleware, handlers.getAnalytics);

export default router;