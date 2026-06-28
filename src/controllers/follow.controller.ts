import { type Request, type Response, type NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import {
  followUser,
  getListFollowService,
  unfollowUser,
} from "../services/follow.service.js";

export const followController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.userId;
  const targetUserId = Number(req.params.userId);

  try {
    if (!userId || userId == null) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (Number.isNaN(targetUserId)) {
      return res.status(400).json({
        message: "Invalid userId parameter",
      });
    }

    const result = await followUser(userId, targetUserId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const unfollowController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.userId;
  const targetUserId = Number(req.params.userId);

  try {
    if (!userId || userId == null) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (Number.isNaN(targetUserId)) {
      return res.status(400).json({
        message: "Invalid userId parameter",
      });
    }

    const result = await unfollowUser(userId, targetUserId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getFollowersController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.params.userId);
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword as string | undefined;

  try {
    if (Number.isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid userId parameter",
      });
    }

    const result = await getListFollowService(
      userId,
      "followers",
      limit,
      page,
      keyword,
    );
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getFollowingController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = Number(req.params.userId);
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword as string | undefined;

  try {
    if (Number.isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid userId parameter",
      });
    }

    const result = await getListFollowService(
      userId,
      "following",
      limit,
      page,
      keyword,
    );
    return res.json(result);
  } catch (err) {
    next(err);
  }
};
