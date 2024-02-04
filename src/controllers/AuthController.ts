import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import config from "../config/config";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

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
