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
