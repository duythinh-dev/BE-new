import { Prisma } from "@prisma/client";
import { BadRequestError } from "../errors/BadRequestError.js";
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import {
  countFollowers,
  createFollow,
  deleteFollow,
  findFollow,
  getListFollow,
} from "../repositories/follow.repository.js";
import { findUserById } from "../repositories/user.repository.js";

export const followUser = async (
  currentUserId: number,
  targetUserId: number,
) => {
  if (currentUserId === targetUserId) {
    throw new BadRequestError("You cannot follow yourself");
  }

  const user = await findUserById(targetUserId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const existingFollow = await findFollow(currentUserId, targetUserId);

  if (existingFollow) {
    throw new ConflictError("Already following this user");
  }

  try {
    await createFollow(currentUserId, targetUserId);
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError("Already following this user");
    }

    throw error;
  }

  const totalFollowers = await countFollowers(targetUserId);

  return {
    isFollowing: true,
    followCount: totalFollowers,
  };
};

export const unfollowUser = async (
  currentUserId: number,
  targetUserId: number,
) => {
  if (currentUserId === targetUserId) {
    throw new BadRequestError("You cannot unfollow yourself");
  }

  const existingFollow = await findFollow(currentUserId, targetUserId);

  if (!existingFollow) {
    throw new NotFoundError("Follow relationship not found");
  }

  await deleteFollow(currentUserId, targetUserId);

  const totalFollowers = await countFollowers(targetUserId);

  return {
    isFollowing: false,
    followCount: totalFollowers,
  };
};

export const getListFollowService = async (
  userId: number,
  type: "followers" | "following",
  limit: number,
  page: number,
  keyword?: string,
) => {
  if (limit > 100) {
    limit = 100;
  }
  return getListFollow(userId, type, limit, page, keyword);
};
