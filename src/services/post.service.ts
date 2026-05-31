import {
  addPost,
  removePost,
  updatePost,
  getPostsByUserId,
  getPostById,
  getAllPosts,
} from "../repositories/post.repository.js";

export const createPostForUser = async (
  userId: number,
  title: string,
  content: string,
) => {
  return addPost(userId, title, content);
};

export const deletePost = async (postId: number, userId: number) => {
  return removePost(postId, userId);
};

export const updatePostService = async (
  userId: number,
  postId: number,
  title: string,
  content: string,
) => {
  return updatePost(userId, postId, title, content);
};

export const getUserPosts = async (userId: number) => {
  return getPostsByUserId(userId);
};

export const getPostByIdService = async (postId: number) => {
  return getPostById(postId);
};

export const getAllPostsService = async () => {
  return getAllPosts();
};
