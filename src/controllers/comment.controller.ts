import { getUserById } from "../services/user.service.js";
import { type Request, type Response } from "express";
import { type AuthRequest } from "../middlewares/auth.middleware.js";
import { getPostByIdService } from "../services/post.service.js";
import {
  createCommentService,
  deleteCommentService,
  getComment,
  getCommentsByPostIdService,
  updateCommentService,
} from "../services/comment.service.js";

export const createCommentController = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.userId;
  const { content } = req.body;
  const postId = Number(req.params.postId);
  if (
    typeof userId !== "number" ||
    Number.isNaN(userId) ||
    getUserById(userId) === null
  ) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const posts = await getPostByIdService(postId);
  if (!posts) {
    return res.status(404).json({ message: "Post not found" });
  }

  try {
    await createCommentService(userId, postId, content);
    return res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error creating comment" });
  }
};

export const getCommentsByPostIdController = async (
  req: Request,
  res: Response,
) => {
  const postId = Number(req.params.postId);

  if (Number.isNaN(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }
  try {
    const comments = await getCommentsByPostIdService(postId);
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching comments" });
  }
};

export const deleteCommentController = async (
  req: AuthRequest,
  res: Response,
) => {
  const commentId = Number(req.params.commentId);
  const userId = req.userId;
  if (
    Number.isNaN(commentId) ||
    typeof userId !== "number" ||
    Number.isNaN(userId)
  ) {
    return res.status(400).json({ message: "Invalid comment id or user id" });
  }

  const comment = await getComment(commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const commentOwnerId = comment.user.id;
  if (commentOwnerId !== userId) {
    return res
      .status(403)
      .json({ message: "You can only delete your own comments" });
  }

  try {
    await deleteCommentService(commentId, userId);
    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting comment" });
  }
};

export const updateCommentController = async (
  req: AuthRequest,
  res: Response,
) => {
  const commentId = Number(req.params.commentId);
  const { content } = req.body;
  const userId = req.userId;

  if (
    Number.isNaN(commentId) ||
    typeof userId !== "number" ||
    Number.isNaN(userId)
  ) {
    return res.status(400).json({ message: "Invalid comment id or user id" });
  }

  const comment = await getComment(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const commentOwnerId = comment.user.id;
  if (commentOwnerId !== userId) {
    return res
      .status(403)
      .json({ message: "You can only update your own comments" });
  }

  try {
    await updateCommentService(commentId, userId, content);
    return res.json({ message: "Comment updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating comment" });
  }
};
