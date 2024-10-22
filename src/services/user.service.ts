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
  AnyUser,
  LoginCredentials,
  User,
  UserEntityPublic,
} from '../schema/user.schema';

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

export const getCollection = async (
  currentUserId: string | undefined
): Promise<UserEntityPublic[] | never> => {
  try {
    const result: UserEntityPublic[] = [];
    const users = await userRepository.find(currentUserId);
    users.forEach(user => {
      const res = isFollowingIsFollowed(
        user,
        currentUserId
      ) as UserEntityPublic;
      result.push(res);
    });
    return result;
  } catch (error) {
    if (error instanceof DbError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};

export const getOneById = async (
  id: string,
  currentUserId: string | undefined,
  orThrow = false
): Promise<UserEntityPublic | null | never> => {
  try {
    const user = await userRepository.findOneById(id);
    if (!user && orThrow) {
      throw new NotFoundError(`No user entry corresponds to the id: ${id}`);
    }
    if (user) {
      const result = isFollowingIsFollowed(
        user,
        currentUserId
      ) as UserEntityPublic;
      return result;
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
  currentUserId: string | undefined,
  orThrow = false
): Promise<UserEntityPublic | null | never> => {
  try {
    const user = await userRepository.findOneByEmail(email);
    if (!user && orThrow) {
      throw new NotFoundError(
        `No user entry corresponds to the email: ${email}`
      );
    }
    if (user) {
      const result = isFollowingIsFollowed(
        user,
        currentUserId
      ) as UserEntityPublic;
      return result;
    }
    return user;
  } catch (error) {
    if (error instanceof DbError) {
      throw new AppError(error.message);
    }
    throw error;
  }
};

export const login = async (
  credentials: LoginCredentials
): Promise<{ token: string; id: string; avatar?: string | null }> => {
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

  return { token: authToken, id: user.id, avatar: user.avatar };
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

export const logout = async (authToken: string): Promise<void> => {
  if (!authToken) {
    throw new AppInvalidCredentialsError('User not found');
  }

  await redisClient.redisClient!.del(`authToken:${authToken}`);
};

export const follow = async (
  userId: string,
  followinfId: string
): Promise<User | null | never> => {
  const user = await userRepository.addFollow(userId, followinfId);
  return user;
};

export const isFollowingIsFollowed = (
  user: AnyUser,
  currentUserId?: string
) => {
  const isFollowed = user.followers?.some(
    follower => follower.id === currentUserId
  );
  const isFollowing = user.following?.some(
    following => following.id === currentUserId
  );

  user.isFollowing = isFollowing;
  user.isFollowed = isFollowed;

  return user;
};
