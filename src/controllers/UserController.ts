import { Request, Response } from "express";
import { validate } from "class-validator";
import { Repository } from "typeorm/repository/Repository";

import { AppDataSource } from "../data-source";
import { Invitation } from "../entity/Invitation";
import { User } from "../entity/User";

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
        return res.status(400).send({ message: "Account already exists." });
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
}

export default UserController;
