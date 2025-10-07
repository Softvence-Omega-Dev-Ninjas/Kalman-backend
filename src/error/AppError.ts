export class AppError extends Error {
  public readonly code: number;

  constructor(message: string, code: number = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;

    // Fix for extending built-in classes like Error
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
