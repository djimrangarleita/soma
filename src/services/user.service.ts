import AppError, {
  AppInvalidCredentialsError,
  AppValidationError,
  AppWrongOrExpiredTokenError,
  NotFoundError,
} from '../common/appErrors';
import DbError, {
  NotFoundError as DbNotFoundError,
  ValidationConstraintError,
} from '../common/dbErrors';
import redisClient from '../common/redisClient';
import config from '../config';
import { authentication, random } from '../lib/auth';
import userRepository from '../repositories/user.repository';
import {
  LoginCredentials,
  User,
  UserEntityPublic,
} from '../schema/user.schema';

// TODO: Catch PrismaClientInitializationError at app init
export const create = async (
  userDoc: User
): Promise<UserEntityPublic | never> => {
  try {
    const salt = random();

    userDoc.salt = salt;
    userDoc.password = authentication(salt, userDoc.password);

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
): Promise<UserEntityPublic | never> => {
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

export const getCollection = async (): Promise<UserEntityPublic[] | never> => {
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
): Promise<UserEntityPublic | null | never> => {
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
): Promise<UserEntityPublic | null | never> => {
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

export const login = async (credentials: LoginCredentials): Promise<string> => {
  const user = await userRepository.loadUser(credentials.email);
  if (!user) {
    throw new AppInvalidCredentialsError('User not found');
  }
  const expectedHash = authentication(user.salt!, credentials.password);

  if (user.password !== expectedHash) {
    throw new AppInvalidCredentialsError('Wrong password');
  }

  const salt = random();

  const authToken = authentication(salt, user.id);

  await redisClient.redisClient!.set(
    `authToken:${authToken}`,
    user.id,
    config.AUTH_TOKEN_TTL
  );

  return authToken;
};

export const loadUserFromToken = async (
  authToken: string
): Promise<UserEntityPublic | never> => {
  const userId = await redisClient.redisClient!.get(`authToken:${authToken}`);

  if (!userId) {
    throw new AppWrongOrExpiredTokenError();
  }

  const user = await userRepository.findOneById(userId);

  if (!user) {
    throw new NotFoundError('No user found');
  }

  return user;
};
