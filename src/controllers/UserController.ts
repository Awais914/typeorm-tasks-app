
import { Request, Response } from "express";
import { validate } from "class-validator";
import { Repository } from "typeorm/repository/Repository";

import { AppDataSource } from "../data-source";
import { Invitation } from "../entity/Invitation";
import { User } from "../entity/User";

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

class UserController {
  private userRepository: Repository<User>;
  private invitationRepository: Repository<Invitation>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.invitationRepository = AppDataSource.getRepository(Invitation);
  }

  newUser = async (req: Request, res: Response) => {
    let { email, password } = req.body;
    let user = new User();
    user.email = email;
    user.password = password;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    user.hashPassword();

    try {
      const existingUser = await this.userRepository.findOneBy({ email });

      if (existingUser) {
        return res.status(400).send({ message: 'Account already exists.' });
      }

      await this.userRepository.save(user);
      const invitation = req.invitation as Invitation;
      invitation.expiresAt = new Date();
      await this.invitationRepository.save(invitation);
    } catch (e) {
      console.error(e);
      return res.status(409).send({ message: "Something went wrong!" });
    }

    res.status(201).send({ message: "Account created" });
  };
};

export default UserController;
