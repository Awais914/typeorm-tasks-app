import { Request, Response } from "express";
import { Repository } from "typeorm/repository/Repository";
import { validate } from "class-validator";

import { AppDataSource } from "../data-source";
import { Task } from "../entity/Task";
import { User } from "../entity/User";

class TaskController {
  private userRepository: Repository<User>;
  private taskRepository: Repository<Task>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.taskRepository = AppDataSource.getRepository(Task);
  }

  createTask = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.userId;
    const { title, description } = req.body;
    const task = new Task();
    task.title = title;
    task.description = description;
    const errors = await validate(task);

    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ["id", "email"],
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      task.user = user;
      await this.taskRepository.save(task);

      return res.status(201).json(task);
    } catch (e) {
      console.error(e);
      return res.status(500).send({ message: "Something went wrong!" });
    }
  };

  getTasks = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.userId;

    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const userTasks = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["tasks"],
      });

      if (!userTasks) {
        return res.status(404).send({ message: "Tasks not found" });
      }

      return res.json(userTasks.tasks);
    } catch (error) {
      console.error("Error getting tasks:", error);
      return res.status(500).send({ message: "Something went wrong!" });
    }
  };

  getUserTasks = async (req: Request, res: Response) => {
    const { userId, completed, page, pageSize } = req.query;

    try {
      const take = pageSize > 0 ? parseInt(pageSize as string, 10) : 10;
      const skip = page > 0 ? (parseInt(page as string, 10) - 1) * take : 0;

      const tasks = await this.taskRepository.findAndCount({
        where: {
          user: userId ? { id: userId } : undefined,
          completed: completed ?? undefined,
        },
        take,
        skip,
      });

      if (!tasks) {
        return res.status(404).send("Tasks not found");
      }

      return res.json(tasks);
    } catch (error) {
      console.error("Error getting tasks:", error);
      return res.status(500).send({ message: "Something went wrong!" });
    }
  };

  editTask = async (req: Request, res: Response) => {
    const taskId = req.params.id as number;
    const { title, description, completed } = req.body;
    const userId = res.locals.jwtPayload.userId;

    try {
      const task = await this.taskRepository.findOne({
        where: { id: taskId, user: { id: userId } },
      });

      if (!task) {
        return res.status(404).send({ message: "Task not found!" });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.completed = completed ?? task.completed;

      const updatedTask = await this.taskRepository.save(task);

      return res.json(updatedTask);
    } catch (error) {
      console.error("Error editing task:", error);
      return res.status(500).send({ message: "Something went wrong!" });
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    const taskId = req.params.id as number;
    const userId = res.locals.jwtPayload.userId;

    try {
      const task = await this.taskRepository.findOne({
        where: { id: taskId, user: { id: userId } },
      });

      if (!task) {
        return res.status(404).send({ message: "Task not found!" });
      }

      await this.taskRepository.remove(task);

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).send({ message: "Something went wrong!" });
    }
  };
}

export default TaskController;
