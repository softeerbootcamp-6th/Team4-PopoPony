import { $api } from '@shared/apis';

const getMe = () => {
  return $api.useQuery('get', '/api/auth/me');
};

export default getMe;
