import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import TaskController from "../controllers/TaskController";

const router = Router();
const taskController = new TaskController();

router.post("/", [checkJwt], taskController.createTask);
router.get("/", [checkJwt], taskController.getTasks);
router.get(
  "/user",
  [checkJwt, checkRole(["ADMIN"])],
  taskController.getUserTasks
);
router.patch(
  "/:id([0-9]+)",
  [checkJwt],
  taskController.editTask
);
router.delete(
  "/:id([0-9]+)",
  [checkJwt],
  taskController.deleteTask
);

export default router;
