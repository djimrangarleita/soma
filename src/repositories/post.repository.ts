import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import dbClient from '../common/dbClient';
import DbError, {
  NotFoundError,
  ValidationConstraintError,
} from '../common/dbErrors';
import {
  PartialPost,
  Post,
  PostEntity,
  PostEntityPublic,
} from '../schema/post.schema';
import { IRepository } from './types';

class PostRepository
  implements IRepository<Post & { userId: string }, PostEntity, PartialPost>
{
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async create(
    postDoc: Post & { userId: string }
  ): Promise<PostEntity | never> {
    try {
      const post = await this.client.post.create({
        data: postDoc,
      });
      return post;
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

  async update(id: string, postDoc: PartialPost): Promise<PostEntity | never> {
    try {
      const post = await this.client.post.update({
        where: { id },
        data: postDoc,
      });
      return post;
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

  async delete(id: string): Promise<void> {
    try {
      await this.client.post.delete({
        where: { id },
      });
    } catch (error) {
      const err = error as Error;
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundError();
      }
      throw new DbError();
    }
  }

  async findOneById(id: string): Promise<PostEntityPublic | null | never> {
    try {
      const post = await this.client.post.findUnique({
        where: { id },
        include: {
          comments: {
            select: {
              text: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
              createdAt: true,
              _count: {
                select: {
                  likes: true,
                  children: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });
      return post;
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }

  /**
   * Fetch all posts
   *
   * @returns {PostEntity[]} list of posts
   * @throws {DbError} Will throw an error if request fails
   */
  async find(): Promise<PostEntity[] | never> {
    try {
      const posts = await this.client.post.findMany({
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });
      return posts;
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }
}

const postRepository = new PostRepository(dbClient);

export default postRepository;
