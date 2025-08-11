import { $api } from '@apis';

const postLogin = async () => {
  return $api.useMutation('post', '/api/auth/login');
};

export default postLogin;
