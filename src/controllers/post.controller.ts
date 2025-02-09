import { NextFunction, Request, Response } from 'express-serve-static-core';
import createError from 'http-errors';
import {
  AppForbiddenOperation,
  AppValidationError,
  NotFoundError,
} from '../common/appErrors';
import HttpStatus from '../common/httpStatus';
import { UserRole } from '../schema/user.schema';
import {
  create as createPost,
  edit,
  getCollection,
  getOneById,
  like as likePost,
  remove as removeUser,
} from '../services/post.service';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const { posts, total } = await getCollection(req.user?.id, limit, skip);
    res.send({
      posts,
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

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const post = await createPost({ ...req.body, userId });
    res.status(HttpStatus.Created.code).send(post);
  } catch (error) {
    if (error instanceof AppValidationError) {
      next(new createError.UnprocessableEntity(error.message));
    } else {
      next(error);
    }
  }
};

export const getItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const postEntity = await getOneById(id, req.user?.id, true);

    res.send(postEntity);
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
    const post = await edit(id, req.body);
    res.send(post);
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
    const { user } = req;
    await removeUser(id, user!.id, user!.role === UserRole.ADMIN);
    res.status(HttpStatus.NoContent.code).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      next(new createError.BadRequest(error.message));
    } else if (error instanceof AppForbiddenOperation) {
      next(new createError.Forbidden());
    } else {
      next(error);
    }
  }
};

export const like = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const post = await likePost(id, user!.id);

    res.send(post);
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
