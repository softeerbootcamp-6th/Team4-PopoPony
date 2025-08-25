import { $api } from '@shared/api';

const postLogin = () => {
  return $api.useMutation('post', '/api/auth/login');
};

export default postLogin;
