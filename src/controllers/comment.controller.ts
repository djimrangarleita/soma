import { NextFunction, Request, Response } from 'express-serve-static-core';
import createError from 'http-errors';
import { AppValidationError } from '../common/appErrors';
import HttpStatus from '../common/httpStatus';
import {
  create as createComment,
  getCollection,
  like as likeComment,
} from '../services/comment.service';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = req.params.id;
    const page = Number(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const { comments, total } = await getCollection(
      postId,
      req.user?.id,
      limit,
      skip
    );
    res.send({
      comments,
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
    const postId = req.params.id!;

    const postComment = await createComment({ ...req.body, userId, postId });
    res.status(HttpStatus.Created.code).send(postComment);
  } catch (error) {
    if (error instanceof AppValidationError) {
      next(new createError.UnprocessableEntity(error.message));
    } else {
      next(error);
    }
  }
};

export const like = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const comment = await likeComment(id, userId);
    res.send(comment);
  } catch (error) {
    next(error);
  }
};
