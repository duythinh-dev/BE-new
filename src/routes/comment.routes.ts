import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createCommentController,
  deleteCommentController,
  getCommentsByPostIdController,
  updateCommentController,
} from "../controllers/comment.controller.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, createCommentController); // postId lấy từ parent route
router.get("/", getCommentsByPostIdController); // public
router.put("/:commentId", authMiddleware, updateCommentController);
router.delete("/:commentId", authMiddleware, deleteCommentController);

export default router;
