import prisma from "../prisma.js";
import {
  countLikesByPostId,
  createLike,
  deleteLike,
  existingLikeRepository,
} from "../repositories/like.repository.js";

export const toggleLike = async (userId: number, postId: number) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    let isLiked: boolean;

    const existingLike = await existingLikeRepository(userId, postId);

    if (existingLike) {
      await deleteLike(userId, postId);
      isLiked = false;
    } else {
      await createLike(userId, postId);
      isLiked = true;
    }

    const totalLikes = await countLikesByPostId(postId);

    return {
      isLiked: isLiked,
      likeCount: totalLikes,
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Already liked");
    }

    if (error.code === "P2003") {
      throw new Error("Post not found");
    }

    console.error("Error toggling like:", error);
    throw new Error("Error toggling like");
  }
};
