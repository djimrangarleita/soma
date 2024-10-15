/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express-serve-static-core';
import createError from 'http-errors';

const handleErrors = (
  err: createError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`An error occured: ${err}`);
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).send({
    status: 'error',
    message,
  });
};

/**
 * Middleware to handle 404 Not Found errors.
 */
export const handleNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    status: 'failed',
    message: 'Not found',
  });
};

export default handleErrors;
