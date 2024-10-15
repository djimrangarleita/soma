import AppError, {
  AppValidationError,
  NotFoundError,
} from '../common/appErrors';
import DbError, {
  NotFoundError as DbNotFoundError,
  ValidationConstraintError,
} from '../common/dbErrors';
import userRepository from '../repositories/user.repository';
import { User, UserEntity } from '../schema/user.schema';

// TODO: Catch PrismaClientInitializationError at app init
export const create = async (userDoc: User): Promise<UserEntity | never> => {
  try {
    const user = await userRepository.create(userDoc);
    return user;
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
  userDoc: User
): Promise<UserEntity | never> => {
  try {
    const user = await userRepository.update(id, userDoc);
    return user;
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

export const remove = async (id: string): Promise<void | never> => {
  try {
    await userRepository.delete(id);
  } catch (error) {
    if (error instanceof DbNotFoundError) {
      throw new NotFoundError(`No entry corresponds to the id: ${id}`);
    }
    throw error;
  }
};

export const getCollection = async (): Promise<UserEntity[] | never> => {
  try {
    const users = await userRepository.find();
    return users;
  } catch (error) {
    if (error instanceof DbError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};

export const getOneById = async (
  id: string,
  orThrow = false
): Promise<UserEntity | null | never> => {
  try {
    const user = await userRepository.findOneById(id);
    if (!user && orThrow) {
      throw new NotFoundError(`No user entry corresponds to the id: ${id}`);
    }
    return user;
  } catch (error) {
    if (error instanceof DbError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};

export const getOneByEmail = async (
  email: string,
  orThrow = false
): Promise<UserEntity | null | never> => {
  try {
    const user = await userRepository.findOneByEmail(email);
    if (!user && orThrow) {
      throw new NotFoundError(
        `No user entry corresponds to the email: ${email}`
      );
    }
    return user;
  } catch (error) {
    if (error instanceof DbError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};
