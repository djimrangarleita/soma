import AppError, {
  AppForbiddenOperation,
  AppValidationError,
  NotFoundError,
} from '../common/appErrors';
import DbError, {
  NotFoundError as DbNotFoundError,
  ValidationConstraintError,
} from '../common/dbErrors';
import postRepository from '../repositories/post.repository';
import { Post, PostEntity, PostEntityPublic } from '../schema/post.schema';
import { isFollowingIsFollowed } from './user.service';

export const create = async (
  postDoc: Post & { userId: string }
): Promise<PostEntity | never> => {
  try {
    const post = await postRepository.create(postDoc);
    return post;
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

export const edit = async (
  id: string,
  postDoc: Post
): Promise<PostEntity | never> => {
  try {
    const post = await postRepository.update(id, postDoc);
    return post;
  } catch (error) {
    if (error instanceof ValidationConstraintError) {
      throw new AppValidationError(error.message);
    }
    if (error instanceof DbNotFoundError) {
      throw new NotFoundError(`No entry corresponds to the id: ${id}`);
    }
    if (error instanceof DbError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};

export const remove = async (
  id: string,
  userId: string,
  isAdmin = false
): Promise<void | never> => {
  try {
    if (isAdmin) {
      await postRepository.delete(id);
      return;
    }
    const post = await getOneById(id, undefined, true);
    if (post!.userId !== userId) {
      throw new AppForbiddenOperation();
    }
    await postRepository.delete(id);
  } catch (error) {
    if (error instanceof DbNotFoundError) {
      throw new NotFoundError(`No entry corresponds to the provided id`);
    }
    throw error;
  }
};

export const getCollection = async (
  currentUserId?: string,
  take?: number,
  skip?: number
): Promise<{ posts: PostEntity[] | never; total: number }> => {
  try {
    const { collection, total } = await postRepository.find(
      currentUserId,
      take,
      skip
    );
    // TODO: Find a way to optimize this block
    const posts = await Promise.all(
      collection.map(async post => {
        post.user = isFollowingIsFollowed(post.user, currentUserId);
        post.isLiked = await postRepository.isLikedByCurrentUser(
          post.id,
          currentUserId
        );

        return post;
      })
    );
    return { posts, total };
  } catch (error) {
    if (error instanceof DbError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};

export const getOneById = async (
  id: string,
  currentUserId?: string,
  orThrow = false
): Promise<PostEntityPublic | null | never> => {
  try {
    const post = await postRepository.findOneById(id);
    if (!post && orThrow) {
      throw new NotFoundError(`No post entry corresponds to the id: ${id}`);
    }
    if (post) {
      post.user = isFollowingIsFollowed(post.user, currentUserId);
      post.isLiked = await postRepository.isLikedByCurrentUser(
        post.id,
        currentUserId
      );
    }
    return post;
  } catch (error) {
    if (error instanceof DbError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};

export const like = async (
  id: string,
  userId: string
): Promise<PostEntityPublic | null | never> => {
  try {
    const post = await postRepository.addLike(id, userId);
    post!.isLiked = await postRepository.isLikedByCurrentUser(id, userId);

    return post;
  } catch (error) {
    if (error instanceof ValidationConstraintError) {
      throw new AppValidationError(error.message);
    }
    if (error instanceof DbNotFoundError) {
      throw new NotFoundError(`No entry corresponds to the id: ${id}`);
    }
    if (error instanceof DbError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};
