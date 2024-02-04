import { Router } from "express";

import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
import TaskController from "../controllers/TaskController";

const router = Router();
const taskController = new TaskController();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API operations for managing tasks
 */

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Indicates that a Bearer token is required
 *     requestBody:
 *       description: Task details for creating a new task
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the task
 *               description:
 *                 type: string
 *                 description: Description of the task
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: "Task Title"
 *               description: "Task Description"
 *               completed: false
 *       400:
 *         description: Bad request, validation errors
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation error"
 *               errors:
 *                 - field: "title"
 *                   message: "Title is required"
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Something went wrong!"
 */

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Indicates that a Bearer token is required
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: "Task Title"
 *                 description: "Task Description"
 *                 completed: false
 *               - id: 2
 *                 title: "Another Task"
 *                 description: "Task Description"
 *                 completed: true
 *       401:
 *         description: Unauthorized, invalid token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Something went wrong!"
 */

/**
 * @swagger
 * /task/user:
 *   get:
 *     summary: Get all tasks for a specific user or all (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Indicates that a Bearer token is required
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Fetching tasks based on User ID (optional)
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter tasks by completion status (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of tasks per page for pagination
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               tasks:
 *                 - id: 1
 *                   title: "Task Title"
 *                   description: "Task Description"
 *                   completed: false
 *                 - id: 2
 *                   title: "Another Task"
 *                   description: "Task Description"
 *                   completed: true
 *               totalCount: 2
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Something went wrong!"
 */

/**
 * @swagger
 * /task/{id}:
 *   patch:
 *     summary: Edit a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Indicates that a Bearer token is required
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: Task ID to edit
 *     requestBody:
 *       description: Task details for editing a task
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title for the task
 *               description:
 *                 type: string
 *                 description: New description for the task
 *               completed:
 *                 type: boolean
 *                 description: New completion status for the task
 *     responses:
 *       200:
 *         description: Task edited successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: "Updated Task Title"
 *               description: "Updated Task Description"
 *               completed: true
 *       401:
 *         description: Unauthorized, invalid token
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Task not found!"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Something went wrong!"
 */

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []  # Indicates that a Bearer token is required
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: Task ID to delete
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized, invalid token
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Task not found!"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: "Something went wrong!"
 */

router.post("/", [checkJwt], taskController.createTask);
router.get("/", [checkJwt], taskController.getTasks);
router.get(
  "/user",
  [checkJwt, checkRole(["ADMIN"])],
  taskController.getUserTasks
);
router.patch("/:id([0-9]+)", [checkJwt], taskController.editTask);
router.delete("/:id([0-9]+)", [checkJwt], taskController.deleteTask);

export default router;
