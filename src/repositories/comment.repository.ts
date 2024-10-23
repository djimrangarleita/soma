import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import dbClient from '../common/dbClient';
import DbError, { ValidationConstraintError } from '../common/dbErrors';
import {
  PartialPostComment,
  PostComment,
  PostCommentEntity,
} from '../schema/comment.schema';
import { PostEntity, PostEntityPublic } from '../schema/post.schema';
import { IRepository } from './types';

class PostCommentRepository
  implements
    IRepository<
      PostComment & { userId: string } & { postId: string },
      PostCommentEntity,
      PartialPostComment
    >
{
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

  async findOneById(): Promise<PostEntityPublic | null | never> {
    console.log(this.client);
    throw new Error('Not implemented');
  }

  /**
   * Fetch all posts
   *
   * @returns {PostEntity[]} list of posts
   * @throws {DbError} Will throw an error if request fails
   */
  async find(): Promise<{ collection: PostEntity[] | never; total: number }> {
    console.log(this.client);
    throw new Error('Not implemented');
  }
}

const postCommentRepository = new PostCommentRepository(dbClient);

export default postCommentRepository;
