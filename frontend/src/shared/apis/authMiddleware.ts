import type { Middleware } from 'openapi-fetch';

const redirectToLogin = () => {
  alert('로그인 후 이용해주세요.');
  window.location.href = '/login';
};

const authMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.status === 401) {
      redirectToLogin();
      return response;
    }

    // 성공 응답이지만 body.status가 401인 경우 확인
    if (response.status === 200) {
      const responseClone = response.clone();

      try {
        const body = await responseClone.json();
        if (body.status === 401) {
          redirectToLogin();
        }
      } catch {
        return response;
      }
    }

    return response;
  },
};

export default authMiddleware;
