import { NextFunction, Request, Response } from 'express-serve-static-core';
import createError from 'http-errors';
import { AppValidationError } from '../common/appErrors';
import HttpStatus from '../common/httpStatus';
import { create as createComment } from '../services/comment.service';

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
