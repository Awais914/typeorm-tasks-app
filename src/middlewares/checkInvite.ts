import { Request, Response, NextFunction } from "express";

import { AppDataSource } from "../data-source";
import { Invitation } from "../entity/Invitation";

export const checkInvite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const invitationRepository = AppDataSource.getRepository(Invitation);
  const { inviteToken } = req.body;

  if (!inviteToken) {
    res
      .status(401)
      .send({ message: "Please provide a valid invitation token." });
    return;
  }

  const invitation = await invitationRepository.findOne({
    where: { token: inviteToken },
  });

  if (invitation && invitation.expiresAt > new Date()) {
    req.invitation = invitation;
    next();
  } else {
    console.log("Invitation invalid or expired:", inviteToken);
    res.status(401).send({ message: "Invalid invitation token" });
  }
};
