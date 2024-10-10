import userRepository from '../repositories/user.repository';
import { User, UserEntity } from '../schema/user.schema';

export const create = async (userDoc: User): Promise<UserEntity | never> => {
  const user = await userRepository.create(userDoc);

  return user;
};

export const edit = async (
  id: string,
  userDoc: User
): Promise<UserEntity | never> => {
  const user = await userRepository.update(id, userDoc);

  return user;
};

export const remove = async (id: string): Promise<void | never> => {
  await userRepository.delete(id);
};

export const getCollection = async (): Promise<UserEntity[] | never> => {
  const users = await userRepository.find();

  return users;
};

export const getOneById = async (
  id: string
): Promise<UserEntity | null | never> => {
  const user = await userRepository.findOneById(id);

  return user;
};

export const getOneByEmail = async (
  email: string
): Promise<UserEntity | null | never> => {
  const user = await userRepository.findOneByEmail(email);

  return user;
};
