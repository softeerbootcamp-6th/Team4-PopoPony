import { $api } from '@shared/api';

const getMe = () => {
  return $api.useQuery('get', '/api/auth/me');
};

export default getMe;
