import { Router } from "express";

import AuthController from "../controllers/AuthController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API operations for user authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and generate JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: JWT token generated successfully
 *         content:
 *           application/json:
 *             example:
 *               token: "your_generated_token_here"
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 */

router.post("/login", AuthController.login);

export default router;
