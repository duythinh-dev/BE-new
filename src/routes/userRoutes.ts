import { Router } from "express";
import {
  getUsersById,
  createUser,
  getUsers,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id", authMiddleware, getUsersById);
router.get("/", authMiddleware, getUsers);
router.post("/", authMiddleware, createUser);

export default router;
