/* eslint-disable max-classes-per-file */
export default class DbError extends Error {
  constructor(message = 'An database level error occured') {
    super(message);
  }
}

export class NotFoundError extends DbError {
  constructor(message = "Requested entry doesn't exist") {
    super(message);
  }
}

export class ValidationConstraintError extends DbError {
  constructor(message = 'One or more validation constraints failed') {
    super(message);
  }
}
