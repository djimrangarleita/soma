import AppError, { AppValidationError } from '../common/appErrors';
import { ValidationConstraintError } from '../common/dbErrors';
import postCommentRepository from '../repositories/comment.repository';
import { PostComment, PostCommentEntity } from '../schema/comment.schema';

export const create = async (
  commentDoc: PostComment & { userId: string; postId: string }
): Promise<PostCommentEntity | never> => {
  try {
    const comment = await postCommentRepository.create(commentDoc);
    return comment;
  } catch (error) {
    if (error instanceof ValidationConstraintError) {
      throw new AppValidationError(error.message);
    }
    if (error instanceof AppError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};

export const getCollection = async (
  postId: string,
  currentUserId?: string,
  take?: number,
  skip?: number
): Promise<{ comments: PostCommentEntity[]; total: number } | never> => {
  try {
    const { collection, total } = await postCommentRepository.find(
      postId,
      take,
      skip
    );
    const comments = await Promise.all(
      collection.map(async comment => {
        const isLiked = await postCommentRepository.isLikedByCurrentUser(
          comment.id,
          currentUserId
        );
        return { ...comment, isLiked };
      })
    );

    return { comments, total };
  } catch (error) {
    if (error instanceof ValidationConstraintError) {
      throw new AppValidationError(error.message);
    }
    if (error instanceof AppError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};

export const like = async (
  commentId: string,
  userId: string
): Promise<PostCommentEntity | null | never> => {
  try {
    const comment = await postCommentRepository.addLike(commentId, userId);
    const isLiked = await postCommentRepository.isLikedByCurrentUser(
      commentId,
      userId
    );
    return { ...comment, isLiked };
  } catch (error) {
    if (error instanceof ValidationConstraintError) {
      throw new AppValidationError(error.message);
    }
    if (error instanceof AppError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};
