import type { Middleware } from 'openapi-fetch';
import { ApiError, AuthError, NotFoundError, parseDDSS, resolveMessage } from '@apis';

const redirectToLogin = () => {
  alert('로그인 후 이용해주세요.');
  window.location.href = '/login';
};

export const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    // 1) HTTP 에러
    if (!response.ok) {
      let msg = `HTTP ${response.status}`;
      let code: string | undefined;
      try {
        const body = await response.clone().json();
        msg = body?.message ?? msg;
        const rawCode = body?.code ?? body?.errorCode ?? body?.statusCode;
        code = typeof rawCode === 'number' ? String(rawCode) : rawCode;
      } catch {}
      const common = {
        httpStatus: response.status,
        code,
        retryAfterSec: Number(response.headers.get('Retry-After') ?? '') || undefined,
        ...parseDDSS(code),
      } as const;
      if (response.status === 401) {
        redirectToLogin();
        throw new AuthError(msg, common);
      }
      if (response.status === 404) throw new NotFoundError(msg, common);
      throw new ApiError(msg, common);
    }

    // 2) HTTP 200 이지만 바디가 에러 포맷
    try {
      const clone = response.clone();
      const body = await clone.json();

      const rawCode = body?.code;
      const code = typeof rawCode === 'number' ? String(rawCode) : rawCode;

      const isError =
        body?.ok === false ||
        (typeof body?.status === 'number' && body.status >= 400) ||
        (typeof code === 'string' && /^\d{6}$/.test(code));

      if (isError) {
        const httpStatus =
          typeof body?.status === 'number' && body.status >= 400 ? body.status : 200;
        const base = { httpStatus, code, ...parseDDSS(code) } as const;

        // 로그인 유지: 401이면 리다이렉트 후 AuthError
        if (httpStatus === 401) {
          redirectToLogin();
          throw new AuthError('인증이 필요합니다.', base);
        }

        // 서버 메시지는 무시하고, 코드 기반 메시지 생성 시도
        try {
          const message = resolveMessage({ code });
          if (httpStatus === 404) throw new NotFoundError(message, base);
          throw new ApiError(message, base);
        } catch {
          // 코드가 6자리 문자열이 아니거나 파싱 실패 시 알 수 없는 에러 처리
          throw new ApiError('알 수 없는 오류가 발생했습니다.', base);
        }
      }
    } catch {
      // body가 JSON이 아니면 정상일 수 있으니 통과
    }

    return response;
  },

  async onError({ error }) {
    if (error instanceof Error) {
      throw new ApiError(error.message);
    }
    throw error;
  },
};

export default errorMiddleware;
