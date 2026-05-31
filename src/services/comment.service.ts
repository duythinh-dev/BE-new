import {
  addCommentToPost,
  deleteComment,
  getCommentById,
  getCommentsByPostId,
  updateComment,
} from "../repositories/comment.repository.js";

export const createCommentService = async (
  userId: number,
  postId: number,
  content: string,
) => {
  return addCommentToPost(userId, postId, content);
};

export const getCommentsByPostIdService = async (postId: number) => {
  return getCommentsByPostId(postId);
};

export const deleteCommentService = async (
  commentId: number,
  userId: number,
) => {
  return deleteComment(commentId, userId);
};

export const updateCommentService = async (
  commentId: number,
  userId: number,
  content: string,
) => {
  return updateComment(commentId, userId, content);
};

export const getComment = async (commentId: number) => {
  return getCommentById(commentId);
};
