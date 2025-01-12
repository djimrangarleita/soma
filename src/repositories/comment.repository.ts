import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import dbClient from '../common/dbClient';
import DbError, { ValidationConstraintError } from '../common/dbErrors';
import { PostComment, PostCommentEntity } from '../schema/comment.schema';
import { PostEntity } from '../schema/post.schema';

class PostCommentRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async create(
    commentDoc: PostComment & { userId: string } & { postId: string }
  ): Promise<PostCommentEntity | never> {
    try {
      const postComment = await this.client.comment.create({
        data: commentDoc,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              _count: true,
            },
          },
          _count: true,
        },
      });
      return postComment;
    } catch (error) {
      const err = error as Error;
      if (
        err instanceof PrismaClientValidationError ||
        err instanceof PrismaClientKnownRequestError
      ) {
        throw new ValidationConstraintError();
      }
      throw new DbError();
    }
  }

  async update(): Promise<PostEntity | never> {
    console.log(this.client);
    throw new Error('Not implemented');
  }

  async delete(): Promise<void> {
    console.log(this.client);
    throw new Error('Not implemented');
  }

  async findOneById(id: string): Promise<PostCommentEntity | null | never> {
    return this.client.comment.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            _count: true,
          },
        },
        _count: true,
      },
    });
  }

  /**
   * Fetch all posts
   *
   * @returns {PostCommentEntity[]} list of posts
   * @throws {DbError} Will throw an error if request fails
   */
  async find(
    postId: string,
    take?: number,
    skip?: number
  ): Promise<{ collection: PostCommentEntity[] | never; total: number }> {
    const comments = await this.client.comment.findMany({
      where: {
        postId,
      },
      take,
      skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            _count: true,
          },
        },
        _count: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { collection: comments, total: comments.length };
  }

  async isLikedByCurrentUser(
    commentId: string,
    userId: string | undefined
  ): Promise<boolean | never> {
    if (!userId) {
      return false;
    }
    const commentLike = await this.client.commentLike.findUnique({
      where: {
        commentId_userId: { commentId, userId },
      },
    });

    return commentLike !== null;
  }

  async addLike(
    commentId: string,
    userId: string
  ): Promise<PostCommentEntity | never> {
    try {
      const isLiked = await this.isLikedByCurrentUser(commentId, userId);

      if (isLiked) {
        // Remove the like
        await this.client.commentLike.delete({
          where: {
            commentId_userId: { commentId, userId },
          },
        });
      } else {
        // Add a like
        await this.client.commentLike.create({
          data: {
            commentId,
            userId,
          },
        });
      }
      const comment = await this.findOneById(commentId);

      return comment!;
    } catch (error) {
      if (
        error instanceof PrismaClientValidationError ||
        error instanceof PrismaClientKnownRequestError
      ) {
        throw new ValidationConstraintError();
      }
      throw new DbError();
    }
  }
}

const postCommentRepository = new PostCommentRepository(dbClient);

export default postCommentRepository;
