import { Request, Response } from "express";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { AppDataSource } from "../data-source";
import { Invitation } from "../entity/Invitation";

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
 * tags:
 *   name: Invitations
 *   description: API operations for managing invitations
 */

/**
 * @swagger
 * /user/sendInvite:
 *   post:
 *     summary: Send invitation to a user
 *     tags: [Invitations]
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

class InviteController {
  private invitationRepository: Repository<Invitation>;

  constructor() {
    this.invitationRepository = AppDataSource.getRepository(Invitation);
  }

  sendInvite = async (req: Request, res: Response) => {
    const { email: inviteeEmail } = req.body;

    if (!inviteeEmail) {
      res.status(400).send({ message: "email is missing" });
      return;
    }

    try {
      const existingInvitation = await this.invitationRepository.findOne({
        where: { inviteeEmail: inviteeEmail },
      });

      if (!existingInvitation) {
        const inviteToken = uuidv4();
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        const invitation = this.invitationRepository.create({
          token: inviteToken,
          expiresAt: expirationDate,
          inviteeEmail: inviteeEmail,
        });

        await this.invitationRepository.save(invitation);

        res.status(200).send({ invitationToken: inviteToken });
        return;
      } else {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        existingInvitation.expiresAt = expirationDate;

        await this.invitationRepository.save(existingInvitation);
        res.status(200).send({ invitationToken: existingInvitation.token });
      }
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: "Something went wrong!" });
    }
  };
}

export default InviteController;
