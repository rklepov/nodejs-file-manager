// src/exception.js

export class InvalidInput extends Error {
  constructor(message) {
    super(`Invalid input: ${message}`);
  }
}

export class OperationFailure extends Error {
  constructor(message) {
    super(`Operation failed: ${message}`);
  }
}

//__EOF__
