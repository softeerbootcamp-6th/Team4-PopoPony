import type { paths } from '../types/api/schema';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import errorMiddleware from './middleware/middleware';

const client = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',
});

client.use(errorMiddleware);

export const $api = createClient(client);

// fetch: 빠른 단발성 체크용(validation 등)
export const $fetch = client;
