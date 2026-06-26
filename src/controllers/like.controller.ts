import { type Request, type Response, type NextFunction } from "express";
import { toggleLike } from "../services/like.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export const likeController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.userId;
  const postId = Number(req.params.postId);

  try {
    if (!userId || userId == null) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (Number.isNaN(postId)) {
      return res.status(400).json({
        message: "Invalid postId",
      });
    }

    const result = await toggleLike(userId, postId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};
