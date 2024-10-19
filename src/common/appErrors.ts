/* eslint-disable max-classes-per-file */
export default class AppError extends Error {
  constructor(message = 'An app level error occured') {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'No record corresponds to the provided parameter') {
    super(message);
  }
}

export class AppValidationError extends AppError {
  constructor(message = 'Data validation failed') {
    super(message);
  }
}

export class AppInvalidCredentialsError extends AppError {
  constructor(message = 'Invalid credentials') {
    super(message);
  }
}

export class AppRedisClientInitializationError extends AppError {
  constructor(message = 'Redis client not initialized') {
    super(message);
  }
}

export class AppRedisClientError extends AppError {
  constructor(message = 'Redis client error') {
    super(message);
  }
}

export class AppWrongOrExpiredTokenError extends AppError {
  constructor(message = "The provided token doesn't exist in the store") {
    super(message);
  }
}

export class AppForbiddenOperation extends AppError {
  constructor(message = 'Current user not allowed to perform this operation') {
    super(message);
  }
}
