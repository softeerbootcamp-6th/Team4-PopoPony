import type { Middleware } from 'openapi-fetch';

import { resolveMessage } from './errorTypes';
import {
  ApiError,
  AuthError,
  HTTPError,
  NetworkError,
  NotFoundError,
  ServerError,
  type TBusinessResponse,
  TimeoutError,
} from './errors';

//json 타입은 모름. 리턴은 promise 객체
async function readJson<T = unknown>(response: Response): Promise<T | null> {
  try {
    return (await response.clone().json()) as T;
  } catch {
    return null;
  }
}

export const errorMiddleware: Middleware = {
  onRequest({ request }) {
    // 5초 이상 Pending 상태가 되면 timeout 에러 발생
    try {
      const abortSignal = (
        AbortSignal as unknown as { timeout?: (ms: number) => AbortSignal }
      ).timeout?.(5000);
      if (abortSignal) {
        return new Request(request, { signal: abortSignal });
      }
    } catch {}
    return undefined;
  },
  async onResponse({ response }) {
    const status = response.status;
    const body = await readJson<TBusinessResponse>(response);
    console.log('body from middleware', body);
    /**
     * body는 네트워크 에러가 아닌 이상 항상
     * code: number, status: number, message: string, data:[]
     * 이렇게 온다.
     */

    // HTTP layer
    if (status >= 500) {
      const message = resolveMessage({
        message: body?.message,
        code: body?.code ? String(body.code) : undefined,
      });
      throw new ServerError(status, message, body?.code);
    }
    if (status === 401 || status === 403) {
      const message = resolveMessage({
        message: body?.message,
        code: body?.code ? String(body.code) : undefined,
      });
      throw new AuthError(status, message, body?.code);
    }
    if (status === 404) {
      throw new NotFoundError(status, 'Not Found', body?.code);
    }
    if (!response.ok) {
      throw new HTTPError(status, response.statusText || 'HTTP Error');
    }

    // 백엔드 컨벤션 관련 에러 (HTTP 2xx 이지만 body에 에러 정보가 있음)
    if (body && typeof body.status === 'number' && body.status !== 200) {
      const message = resolveMessage({
        message: body.message,
        code: body.code ? String(body.code) : undefined,
      });
      if (body.status === 404) throw new NotFoundError(body.status, message, body.code);
      if (body.status === 401 || body.status === 403)
        throw new AuthError(body.status, message, body.code);
      throw new ApiError(body.status, body.code, message, body.data);
    }

    return response;
  },
  async onError({ error }) {
    // TimeoutError
    // console.log('error from middleware', error);
    if (error && typeof error === 'object' && (error as Error).name === 'AbortError') {
      throw new TimeoutError('서버 응답이 없습니다. 다시 시도해주세요.');
    }
    if (error instanceof TypeError) {
      throw new NetworkError(
        '네트워크 오류가 발생했습니다. 인터넷 연결 또는 서버 상태를 확인해주세요.'
      );
    }
    throw error;
  },
};

export default errorMiddleware;
