import { rest } from 'msw';

export const handlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.status(401), ctx.json({ message: '로그인 실패' }));
  }),
];
