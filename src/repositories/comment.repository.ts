import prisma from "../prisma.js";

export const addCommentToPost = async (
  userId: number,
  postId: number,
  content: string,
) => {
  return prisma.comment.create({
    data: {
      postId,
      userId,
      content,
    },
  });
};

export const getCommentsByPostId = async (postId: number) => {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      user: { select: { id: true, name: true } }, // kèm tên người comment
    },
  });
};

export const getCommentById = async (commentId: number) => {
  return prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

export const deleteComment = async (commentId: number, userId: number) => {
  return prisma.comment.delete({
    where: { id: commentId, userId },
  });
};

export const updateComment = async (
  commentId: number,
  userId: number,
  content: string,
) => {
  return prisma.comment.update({
    where: { id: commentId, userId },
    data: { content },
  });
};
