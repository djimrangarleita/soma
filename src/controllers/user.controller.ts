import { NextFunction, Request, Response } from 'express-serve-static-core';
import createError from 'http-errors';
import { AppValidationError, NotFoundError } from '../common/appErrors';
import HttpStatus from '../common/httpStatus';
import {
  create,
  edit,
  getCollection,
  getOneById,
  remove as removeUser,
} from '../services/user.service';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getCollection();
    res.send(users);
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
    const user = await getOneById('73de8864-6cd6-4ea1-87d1-ea75d4a6dc61', true);
    res.send(user);
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
    const { id } = req.params;
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
