import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import dbClient from '../common/db_client';
import DbError, {
  NotFoundError,
  ValidationConstraintError,
} from '../common/dbErrors';
import { PartialUser, User, UserEntity } from '../schema/user.schema';
import { IRepository } from './types';

class UserRepository implements IRepository<User, UserEntity, PartialUser> {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async create(userDoc: User): Promise<UserEntity | never> {
    try {
      const user = await this.client.user.create({
        data: userDoc,
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

  async update(id: string, userDoc: PartialUser): Promise<UserEntity | never> {
    // TODO: Will crash if not found: PrismaClientKnownRequestError
    // PrismaClientValidationError
    try {
      const user = await this.client.user.update({
        where: {
          id,
        },
        data: userDoc,
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

  async findOneById(id: string): Promise<UserEntity | null | never> {
    try {
      const user = await this.client.user.findUnique({ where: { id } });
      return user;
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity | null | never> {
    try {
      const user = await this.client.user.findUnique({ where: { email } });
      return user;
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }

  /**
   * Fetch all users
   *
   * @returns {UserEntity[]} list of users
   * @throws {DbError} Will throw an error if request fails
   */
  async find(): Promise<UserEntity[] | never> {
    try {
      const users = await this.client.user.findMany();
      return users;
    } catch (error) {
      const err = error as Error;
      throw new DbError(err.message);
    }
  }
}

const userRepository = new UserRepository(dbClient);

export default userRepository;
