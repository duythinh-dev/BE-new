import { Router } from "express";
import {
  createPostController,
  deletePostController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createPostController);
router.put("/:postId", authMiddleware, updatePostController);
router.delete("/:postId", authMiddleware, deletePostController);
router.get("/all", authMiddleware, getAllPostsController);
router.get("/:postId", getPostByIdController);

export default router;
