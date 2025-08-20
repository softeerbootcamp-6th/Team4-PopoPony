export interface ApiErrorContext {
  httpStatus?: number;
  code?: string;
  retryAfterSec?: number;
  domain?: string;
  sub?: string;
  type?: string;
}

export class ApiError extends Error {
  public httpStatus?: number;
  public code?: string;
  public retryAfterSec?: number;
  public domain?: string;
  public sub?: string;
  public type?: string;

  constructor(message: string, context?: ApiErrorContext) {
    super(message);
    this.name = 'ApiError';
    if (context) {
      this.httpStatus = context.httpStatus;
      this.code = context.code;
      this.retryAfterSec = context.retryAfterSec;
      this.domain = context.domain;
      this.sub = context.sub;
      this.type = context.type;
    }
  }
}

export class AuthError extends ApiError {
  constructor(message: string, context?: ApiErrorContext) {
    super(message, context);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, context?: ApiErrorContext) {
    super(message, context);
    this.name = 'NotFoundError';
  }
}
