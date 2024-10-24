import { NextFunction, Request, Response } from 'express-serve-static-core';
import createError from 'http-errors';
import {
  UserEntityPublic,
  UserRole,
  UserRoleType,
} from '../../schema/user.schema';
import { loadUserFromToken } from '../../services/user.service';

export const getUser = async (
  token: string
): Promise<UserEntityPublic | never> => loadUserFromToken(token);

export const isGranted =
  (role: UserRoleType = UserRole.USER) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let user: UserEntityPublic;

    const token = req.headers['x-token'] as string;

    // Auth required but no token
    if (!token) {
      next(new createError.Unauthorized());
      return;
    }

    // Auth required and token found
    try {
      user = await getUser(token!);
      // Auth required and user found but role mismatch and admin has all access
      if (user.role !== role && user.role !== UserRole.ADMIN) {
        next(new createError.Forbidden());
        return;
      }

      req.user = user;
    } catch (error) {
      console.error(error);
      next(new createError.Unauthorized());
    }

    next();
  };

export const attachUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['x-token'] as string;
  if (!token) {
    next();
  } else {
    try {
      const user = await getUser(token);
      req.user = user;
    } catch (error) {
      const err = error as Error;
      console.error(err);
    }
    next();
  }
};
