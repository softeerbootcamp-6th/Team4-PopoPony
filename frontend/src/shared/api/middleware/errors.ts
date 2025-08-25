export type TBusinessResponse<T = unknown> = {
  status: number; // HTTP status code(백엔드에서 정의)
  code: number; // 6-digit business code per convention
  message?: string;
  data?: T;
};

export class HTTPError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'HTTPError';
  }
}

export class ServerError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: number
  ) {
    super(message);
    this.name = 'ServerError';
  }
}

export class AuthError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ApiError<T = unknown> extends Error {
  constructor(
    public status: number,
    public code: number | undefined,
    message: string,
    public data?: T
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timed out.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export function isAuthError(err: unknown): err is AuthError {
  return err instanceof AuthError;
}

export const getErrorLabel = (error: unknown) => {
  if (error instanceof AuthError) return 'AuthError';
  if (error instanceof ApiError) return 'ApiError';
  if (error instanceof HTTPError) return 'HTTPError';
  if (error instanceof ServerError) return 'ServerError';
  if (error instanceof TimeoutError) return 'TimeoutError';
  if (error instanceof NetworkError) return 'NetworkError';
  if (error instanceof NotFoundError) return 'NotFoundError';
  return 'Error';
};

// export const getErrorDescription = (error: unknown) => {
//   if (error instanceof AuthError) return '권한이 없습니다.';
//   if (error instanceof ApiError) return 'API 오류가 발생했습니다.';
//   if (error instanceof HTTPError) return 'HTTP 오류가 발생했습니다.';
//   if (error instanceof ServerError) return '서버 오류가 발생했습니다.';
//   if (error instanceof TimeoutError) return '요청 시간이 초과되었습니다.';
//   if (error instanceof NetworkError) return '네트워크 오류가 발생했습니다.';
//   if (error instanceof NotFoundError) return '존재하지 않는 리소스입니다.';
//   return '알 수 없는 오류가 발생했습니다.';
// };

export class NotFoundError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: number
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error occurred.') {
    super(message);
    this.name = 'NetworkError';
  }
}
