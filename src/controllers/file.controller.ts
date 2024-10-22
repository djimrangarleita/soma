import { NextFunction, Request, Response } from 'express-serve-static-core';
import createError from 'http-errors';
import config from '../config';

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      next(new createError.BadRequest('No file uploaded'));
    }
    const filePath = `${config.APP_SERVER}/${req.file!.path}`;
    res.status(201).send({ filePath });
  } catch (error) {
    next(error);
  }
};
