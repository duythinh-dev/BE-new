import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  followController,
  getFollowersController,
  getFollowingController,
  unfollowController,
} from "../controllers/follow.controller.js";

const router = Router({ mergeParams: true });

router.post("/:userId/follow", authMiddleware, followController); // postId lấy từ parent route
router.post("/:userId/unfollow", authMiddleware, unfollowController); // postId lấy từ parent route
router.get("/:userId/followers", getFollowersController); // public
router.get("/:userId/following", getFollowingController); // public

export default router;
