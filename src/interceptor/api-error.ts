import { HttpStatus } from '@nestjs/common';

export default class ApiError extends Error {
  message: string;
  status: string;
  code: HttpStatus;

  constructor(code: HttpStatus, status?: string, message?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
    Error.captureStackTrace(this, ApiError);
  }

  isEqualTo(other: ApiError): boolean {
    return (
      this.status === other.status &&
      this.code === other.code &&
      this.message === other.message
    );
  }
}
