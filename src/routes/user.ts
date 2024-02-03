import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import { checkInvite } from "../middlewares/checkInvite";
import InviteController from "../controllers/InviteController";
import UserController from "../controllers/UserController";

const router = Router();
const inviteController = new InviteController();
const userController = new UserController();

router.post("/", [checkInvite], userController.newUser);
router.post(
  "/sendInvite",
  [checkJwt, checkRole(["ADMIN"])],
  inviteController.sendInvite
);

export default router;
