import prisma from "../prisma.js";

export const addPost = async (
  userId: number,
  title: string,
  content: string,
) => {
  return prisma.post.create({
    data: {
      userId,
      title,
      content,
    },
  });
};

export const removePost = async (postId: number, userId: number) => {
  return prisma.post.delete({
    where: { id: postId, userId },
  });
};

export const updatePost = async (
  userId: number,
  postId: number,
  title: string,
  content: string,
) => {
  return prisma.post.update({
    where: { id: postId, userId },
    data: { title, content },
  });
};

export const getPostsByUserId = async (userId: number) => {
  return prisma.post.findMany({
    where: { userId },
    include: {
      user: { select: { id: true, name: true } }, // kèm tên người tạo
      comments: {
        select: {
          id: true,
          content: true,
          userId: true,
          user: { select: { id: true, name: true } },
        },
      },
    },
  });
};

export const getPostById = async (postId: number) => {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: { select: { id: true, name: true } }, // kèm tên người tạo
      comments: {
        select: {
          id: true,
          content: true,
          userId: true,
          user: { select: { id: true, name: true } },
        },
      },
    },
  });
};

export const getAllPosts = async () => {
  return prisma.post.findMany({
    include: {
      user: { select: { id: true, name: true } }, // kèm tên người tạo
      comments: {
        select: {
          id: true,
          content: true,
          userId: true,
          user: { select: { id: true, name: true } },
        },
      },
    },
  });
};
