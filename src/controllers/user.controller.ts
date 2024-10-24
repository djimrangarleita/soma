import { NextFunction, Request, Response } from 'express-serve-static-core';
import createError from 'http-errors';
import {
  AppInvalidCredentialsError,
  AppValidationError,
  NotFoundError,
} from '../common/appErrors';
import DbError from '../common/dbErrors';
import HttpStatus from '../common/httpStatus';
import {
  follow as addFollow,
  create,
  edit,
  getCollection,
  getOneById,
  remove as removeUser,
  login as userLogin,
  logout as userLogout,
} from '../services/user.service';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const { users, total } = await getCollection(req.user?.id, limit, skip);
    res.send({
      users,
      meta: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await create(req.body);
    res.status(HttpStatus.Created.code).send(user);
  } catch (error) {
    if (error instanceof AppValidationError) {
      next(new createError.UnprocessableEntity(error.message));
    } else {
      next(error);
    }
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id || req.user!.id;

    const userEntity = await getOneById(id, req.user?.id, true);

    res.send(userEntity);
  } catch (error) {
    if (error instanceof NotFoundError) {
      next(new createError.NotFound());
    } else {
      next(error);
    }
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await edit(id, req.body);
    res.send(user);
  } catch (error) {
    if (error instanceof AppValidationError) {
      next(new createError.UnprocessableEntity(error.message));
    } else if (error instanceof NotFoundError) {
      next(new createError.BadRequest(error.message));
    } else {
      next(error);
    }
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id || req.user!.id;
    await removeUser(id);
    res.status(HttpStatus.NoContent.code).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      next(new createError.BadRequest(error.message));
    } else {
      next(error);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userLogin(req.body);
    res.send(user);
  } catch (error) {
    if (error instanceof AppInvalidCredentialsError) {
      next(new createError.Unauthorized('Wrong credentials'));
    } else if (error instanceof DbError) {
      next(new createError.Unauthorized());
    } else {
      next(error);
    }
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers['x-token'] as string | undefined;
    if (token) {
      await userLogout(token);
    }
    res.status(200).send();
  } catch (error) {
    if (error instanceof AppInvalidCredentialsError) {
      next(new createError.Unauthorized());
    } else if (error instanceof DbError) {
      next(new createError.Unauthorized());
    } else {
      next(error);
    }
  }
};

export const follow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const user = await addFollow(userId!, id);
    res.send(user);
  } catch (error) {
    next(error);
  }
};
