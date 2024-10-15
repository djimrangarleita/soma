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
