import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { checkInvite } from "../middlewares/checkInvite";
import InviteController from "../controllers/InviteController";
import UserController from "../controllers/UserController";

const router = Router();
const inviteController = new InviteController();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API operations for managing users
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       description: User details for creating a new account
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password for the user
 *               inviteToken:
 *                 type: string
 *                 description: Invite Token for signup
 *     responses:
 *       201:
 *         description: User account created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Account created"
 *       400:
 *         description: Bad request, validation errors or existing account
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation error"
 *               errors:
 *                 - field: "email"
 *                   message: "Email is required"
 *       409:
 *         description: Conflict, user account already exists
 *         content:
 *           application/json:
 *             example:
 *               message: "Account already exists."
 *       401:
 *         description: Invalid invitation token.
 *         content:
 *           application/json:
 *             example:
 *               message: "Please provide a valid invitation token."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Something went wrong!"
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - bearerAuth: []
 */

/**
 * @swagger
 * /user/sendInvite:
 *   post:
 *     summary: Send invitation to a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Indicates that a Bearer token is required
 *     requestBody:
 *       description: Email of the invitee
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the invitee
 *     responses:
 *       200:
 *         description: Invitation sent successfully
 *         content:
 *           application/json:
 *             example:
 *               invitationToken: "generated_invite_token"
 *       400:
 *         description: Bad request, email is missing
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal Server Error
 */

router.post("/", [checkInvite], userController.newUser);
router.post(
  "/sendInvite",
  [checkJwt, checkRole(["ADMIN"])],
  inviteController.sendInvite
);

export default router;
