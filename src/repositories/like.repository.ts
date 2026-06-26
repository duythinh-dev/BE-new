import prisma from "../prisma.js";

export const createLike = async (userId: number, postId: number) => {
  return await prisma.like.create({
    data: {
      userId,
      postId,
    },
  });
};

export const deleteLike = async (userId: number, postId: number) => {
  return prisma.like.delete({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
};

export const countLikesByPostId = async (postId: number) => {
  return prisma.like.count({
    where: {
      postId,
    },
  });
};

export const existingLikeRepository = async (
  userId: number,
  postId: number,
) => {
  return prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
};
