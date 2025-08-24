import { $api } from '@shared/apis';

const postLogin = () => {
  return $api.useMutation('post', '/api/auth/login');
};

export default postLogin;
