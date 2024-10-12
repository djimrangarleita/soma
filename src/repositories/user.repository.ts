import { PrismaClient } from '@prisma/client';
import dbClient from '../common/db_client';
import { PartialUser, User, UserEntity } from '../schema/user.schema';
import { IRepository } from './types';

class UserRepository implements IRepository<User, UserEntity, PartialUser> {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async create(userDoc: User): Promise<UserEntity | never> {
    const user = await this.client.user.create({
      data: userDoc,
    });

    return user;
  }

  async update(id: string, userDoc: PartialUser): Promise<UserEntity | never> {
    // TODO: Will crash if not found: PrismaClientKnownRequestError
    const user = await this.client.user.update({
      where: {
        id,
      },
      data: userDoc,
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    // TODO: Will crash if not found: PrismaClientKnownRequestError
    await this.client.user.delete({
      where: {
        id,
      },
    });
  }

  async findOneById(id: string): Promise<UserEntity | null | never> {
    const user = await this.client.user.findUnique({ where: { id } });

    return user;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null | never> {
    const user = await this.client.user.findUnique({ where: { email } });

    return user;
  }

  async find(): Promise<UserEntity[] | never> {
    const users = await this.client.user.findMany();

    return users;
  }
}

const userRepository = new UserRepository(dbClient);

export default userRepository;
