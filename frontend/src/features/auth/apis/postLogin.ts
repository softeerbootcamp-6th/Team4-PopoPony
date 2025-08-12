import { $api } from '@apis';

const postLogin = () => {
  return $api.useMutation('post', '/api/auth/login');
};

export default postLogin;
