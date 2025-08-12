import type { paths } from '../types/api/schema';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import authMiddleware from './authMiddleware';

const client = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',
});

client.use(authMiddleware);

export const $api = createClient(client);
