import prisma from "../prisma.js";
import redis from "../redis.js";
import { CHANNELS, publishEvent } from "../services/notification.service.js";

const CACHE_KEY = "posts:all";
const CACHE_TTL = 60; // 60 giây
const CACHE_KEY_DETAIL = (id: number) => `posts:${id}`;
// Helper tạo cache key
const postKey = (id: number) => `posts:${id}`;
const userPostsKey = (userId: number) => `posts:user:${userId}`;

// Xoá tất cả cache liên quan đến posts
const invalidatePostCache = async (postId?: number, userId?: number) => {
  await redis.del(CACHE_KEY);
  if (postId) await redis.del(postKey(postId));
  if (userId) await redis.del(userPostsKey(userId));
  console.log("Cache invalidated!");
};

export const addPost = async (
  userId: number,
  title: string,
  content: string,
) => {
  await invalidatePostCache(undefined, userId); // Xoá cache khi có thay đổi dữ liệu

  await publishEvent(CHANNELS.NEW_POST, { userId, title, content });

  return prisma.post.create({
    data: {
      userId,
      title,
      content,
    },
  });
};

export const removePost = async (postId: number, userId: number) => {
  await invalidatePostCache(postId, userId); // Xoá cache khi có thay đổi dữ liệu

  await publishEvent(CHANNELS.POST_DELETED, { postId, userId });

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
  await invalidatePostCache(postId, userId); // Xoá cache khi có thay đổi dữ liệu

  await publishEvent(CHANNELS.POST_UPDATED, { postId, userId, title, content });

  return prisma.post.update({
    where: { id: postId, userId },
    data: { title, content },
  });
};

export const getPostsByUserId = async (userId: number) => {
  const cached = await redis.get(userPostsKey(userId));

  if (cached) {
    console.log("Cache hit", cached);
    return JSON.parse(cached);
  }

  const posts = await prisma.post.findMany({
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

  if (posts) {
    await redis.set(
      userPostsKey(userId),
      JSON.stringify(posts),
      "EX",
      CACHE_TTL,
    );
  }

  return posts;
};

export const getPostById = async (postId: number) => {
  const cached = await redis.get(CACHE_KEY_DETAIL(postId));

  if (cached) {
    console.log("Cache hit", cached);
    return JSON.parse(cached);
  }
  const post = await prisma.post.findUnique({
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

  if (post)
    await redis.set(
      CACHE_KEY_DETAIL(postId),
      JSON.stringify(post),
      "EX",
      CACHE_TTL,
    );

  return post;
};

export const getAllPosts = async () => {
  const cached = await redis.get(CACHE_KEY);

  if (cached) {
    console.log("Cache hit", cached);
    return JSON.parse(cached);
  }

  const posts = await prisma.post.findMany({
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
  if (posts) await redis.set(CACHE_KEY, JSON.stringify(posts), "EX", CACHE_TTL);

  return posts;
};
