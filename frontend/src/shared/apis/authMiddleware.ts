import type { Middleware } from 'openapi-fetch';

const authMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.status === 200) {
      const responseClone = response.clone();

      try {
        const body = await responseClone.json();
        if (body.status === 401) {
          alert('로그인 후 이용해주세요.');
          window.location.href = '/login';
        }
        return response;
      } catch {
        return response;
      }
    }

    return response;
  },
};

export default authMiddleware;
