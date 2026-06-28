import prisma from "../prisma.js";

export const createFollow = async (
  currentUserId: number,
  targetUserId: number,
) => {
  return prisma.follow.create({
    data: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });
};

export const deleteFollow = (currentUserId: number, targetUserId: number) => {
  return prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });
};

export const countFollowers = (userId: number) => {
  return prisma.follow.count({
    where: {
      followingId: userId,
    },
  });
};

export const countFollowing = (userId: number) => {
  return prisma.follow.count({
    where: {
      followerId: userId,
    },
  });
};

export const findFollow = (followerId: number, followingId: number) => {
  return prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
};

export const getListFollow = (
  userId: number,
  type: "followers" | "following",
  limit: number,
  page: number,

  keyword?: string,
) => {
  const config = {
    followers: {
      where: {
        followingId: userId,
      },
      relation: "follower",
    },
    following: {
      where: {
        followerId: userId,
      },
      relation: "followingUser",
    },
  };
  const skip = (page - 1) * limit;

  return prisma.follow.findMany({
    where: {
      ...config[type].where,
      ...(keyword
        ? {
            [config[type].relation]: {
              is: {
                OR: [
                  {
                    name: {
                      contains: keyword,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: keyword,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          }
        : {}),
    },
    include: {
      [config[type].relation]: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip,
  });
};
