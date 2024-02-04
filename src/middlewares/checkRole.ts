import { Request, Response, NextFunction } from "express";

import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwtPayload.userId;

    const userRepository = AppDataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneBy({ id });
    } catch (error) {
      res.status(401).send();
    }

    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send({ message: "Unauthorized" });
  };
};
