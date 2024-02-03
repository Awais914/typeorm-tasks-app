import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import config from "../config/config";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

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

class AuthController {
  static login = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send({ message: "Invalid credentials" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      res.status(401).send();
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.send(token);
  };
}
export default AuthController;
