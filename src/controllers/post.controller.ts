import {
  createPostForUser,
  deletePost,
  getAllPostsService,
  getPostByIdService,
  getUserPosts,
  updatePostService,
} from "../services/post.service.js";
import { getUserById } from "../services/user.service.js";
import { type Request, type Response } from "express";

// ✅ Đúng — lấy từ token đã verify
import { type AuthRequest } from "../middlewares/auth.middleware.js";

// Post-related controllers
export const createPostController = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { title, content } = req.body;
  if (
    typeof userId !== "number" ||
    Number.isNaN(userId) ||
    getUserById(userId) === null
  ) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Post ID, title, and content are required" });
    }
    const newPost = await createPostForUser(userId, title, content);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

export const deletePostController = async (req: AuthRequest, res: Response) => {
  const postId = Number(req.params.postId);
  const userId = req.user?.userId;
  if (
    Number.isNaN(postId) ||
    typeof userId !== "number" ||
    Number.isNaN(userId)
  ) {
    return res.status(400).json({ message: "Invalid post id or user id" });
  }
  const post = await getPostByIdService(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const postOwnerId = post.userId;
  if (postOwnerId !== userId) {
    return res
      .status(403)
      .json({ message: "You can only delete your own posts" });
  }

  try {
    await deletePost(postId, userId);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

export const updatePostController = async (req: AuthRequest, res: Response) => {
  const postId = Number(req.params.postId);
  const { title, content } = req.body;
  const userId = req.user?.userId;

  if (
    Number.isNaN(postId) ||
    typeof userId !== "number" ||
    Number.isNaN(userId)
  ) {
    return res.status(400).json({ message: "Invalid post id or user id" });
  }
  const post = await getPostByIdService(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const postOwnerId = post.userId;
  if (postOwnerId !== userId) {
    return res
      .status(403)
      .json({ message: "You can only update your own posts" });
  }

  try {
    await updatePostService(userId, postId, title, content);
    res.json({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

export const getUserPostsController = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.user?.userId;
  if (typeof userId !== "number" || Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const posts = await getUserPosts(userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user posts", error });
  }
};

export const getPostByIdController = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  if (Number.isNaN(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }
  try {
    const post = await getPostByIdService(postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const posts = await getAllPostsService();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};
