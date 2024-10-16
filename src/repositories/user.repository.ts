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
        select: publicUser,
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
        select: publicUser,
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
  async find(): Promise<UserEntityPublic[] | never> {
    try {
      const users = await this.client.user.findMany({ select: publicUser });
      return users;
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
}

const userRepository = new UserRepository(dbClient);

export default userRepository;
