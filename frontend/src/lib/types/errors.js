export class AppError extends Error {
    constructor({
      message = 'Something went wrong',
      statusCode = 500,
      errorCode = 'UNKNOWN_ERROR',
    }) {
      super(message);
  
      this.name = 'AppError';
      this.statusCode = statusCode;
      this.errorCode = errorCode;
    }
  }