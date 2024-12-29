import express from "express";
import Users from '../models/Users.js';
const router = express.Router();
import handlers from '../lib/handlers.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Path to your auth middleware

// Public Route

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User signup details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 */
router.post("/signup", handlers.createUser);

// Secure Routes

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 */
router.get('/:id', authMiddleware, handlers.getUser);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update user details
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 */
router.put("/:id", authMiddleware, handlers.updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 */
router.delete("/:id", authMiddleware, handlers.deleteUser);


export default router;