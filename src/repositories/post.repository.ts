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
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              _count: true,
              followers: {
                select: {
                  id: true,
                },
              },
              following: {
                select: {
                  id: true,
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

        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              _count: true,
              followers: {
                select: {
                  id: true,
                },
              },
              following: {
                select: {
                  id: true,
                },
              },
            },
          },
          comments: {
            select: {
              text: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                  _count: true,
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
          likes: {
            take: 5,
            select: {
              user: {
                select: {
                  id: true,
                  avatar: true,
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
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              _count: true,
              followers: {
                select: {
                  id: true,
                },
              },
              following: {
                select: {
                  id: true,
                },
              },
            },
          },
          likes: {
            take: 5,
            select: {
              user: {
                select: {
                  id: true,
                  avatar: true,
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
  async find(
    currentUserId?: string,
    take?: number,
    skip?: number
  ): Promise<{ collection: PostEntity[] | never; total: number }> {
    try {
      const posts = await this.client.post.findMany({
        take,
        skip,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              _count: true,
              followers: {
                select: {
                  id: true,
                },
              },
              following: {
                select: {
                  id: true,
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
        orderBy: {
          createdAt: 'desc',
        },
      });
      const total = await this.client.post.count();
      return { collection: posts, total };
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }

  async isLikedByCurrentUser(
    postId: string,
    userId?: string
  ): Promise<boolean | never> {
    if (!userId) {
      return false;
    }
    const postLike = await this.client.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    return postLike !== null;
  }

  async addLike(
    postId: string,
    userId: string
  ): Promise<PostEntityPublic | null | never> {
    try {
      const isLiked = await this.isLikedByCurrentUser(postId, userId);

      if (isLiked) {
        // Remove the like
        await this.client.postLike.delete({
          where: {
            postId_userId: { postId, userId },
          },
        });
      } else {
        // Add a like
        await this.client.postLike.create({
          data: {
            postId,
            userId,
          },
        });
      }
      const updatedPost = await this.findOneById(postId);

      return updatedPost;
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

const postRepository = new PostRepository(dbClient);

export default postRepository;
