export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Giữ đúng prototype khi extends Error
    Object.setPrototypeOf(this, new.target.prototype);

    // Stack trace đẹp hơn
    Error.captureStackTrace(this);
  }
}
