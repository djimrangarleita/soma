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
  PartialUser,
  publicUser,
  publicUserProfile,
  User,
  UserEntity,
  UserEntityPublic,
} from '../schema/user.schema';
import { IRepository } from './types';

class UserRepository
  implements IRepository<User, UserEntityPublic, PartialUser>
{
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async create(userDoc: User): Promise<UserEntityPublic | never> {
    try {
      const user = await this.client.user.create({
        data: { ...userDoc, salt: userDoc.salt! },
        select: publicUser,
      });
      return user;
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

  async update(
    id: string,
    userDoc: PartialUser
  ): Promise<UserEntityPublic | never> {
    // TODO: Will crash if not found: PrismaClientKnownRequestError
    // PrismaClientValidationError
    try {
      const user = await this.client.user.update({
        where: {
          id,
        },
        data: userDoc,
        select: publicUser,
      });
      return user;
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
      await this.client.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      const err = error as Error;
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundError();
      }
      throw new DbError();
    }
  }

  async findOneById(id: string): Promise<UserEntityPublic | null | never> {
    try {
      const user = await this.client.user.findUnique({
        where: { id },
        select: {
          ...publicUserProfile,
          posts: {
            include: {
              _count: true,
            },
          },
          _count: true,
          followers: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          following: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }

  async findOneByEmail(
    email: string
  ): Promise<UserEntityPublic | null | never> {
    try {
      const user = await this.client.user.findUnique({
        where: { email },
        select: {
          ...publicUserProfile,
          posts: {
            include: {
              _count: true,
            },
          },
          _count: true,
          followers: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          following: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }

  /**
   * Fetch all users
   *
   * @returns {UserEntityPublic[]} list of users
   * @throws {DbError} Will throw an error if request fails
   */
  async find(
    userId?: string,
    take?: number,
    skip?: number
  ): Promise<{ collection: UserEntityPublic[] | never; total: number }> {
    try {
      const users = await this.client.user.findMany({
        take,
        skip,
        where: {
          id: {
            not: userId,
          },
        },
        select: {
          ...publicUser,
          _count: true,
          followers: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          following: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      const total = await this.client.user.count();
      return { collection: users, total };
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }

  async loadUser(email: string): Promise<UserEntity | never> {
    try {
      const user = await this.client.user.findMany({
        where: { email },
      });
      if (!user || user.length > 1) {
        throw new NotFoundError();
      }
      return user[0];
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }

  async isFollowedByCurrentUser(
    userId: string,
    followingId: string
  ): Promise<boolean | never> {
    const user = await this.client.user.findUnique({
      where: {
        id: userId,
        following: {
          some: {
            id: followingId,
          },
        },
      },
    });

    return user !== null;
  }

  async addFollow(
    userId: string,
    followingId: string
  ): Promise<UserEntity | null | never> {
    let key = 'connect';
    const following = await this.isFollowedByCurrentUser(userId, followingId);
    if (following) {
      key = 'disconnect';
    }
    const updatedUser = await this.client.user.update({
      where: {
        id: userId,
      },
      data: {
        following: {
          [key]: {
            id: followingId,
          },
        },
      },
    });
    return updatedUser;
  }
}

const userRepository = new UserRepository(dbClient);

export default userRepository;
