import { $api } from '@apis';

const postHelperProfile = () => {
  return $api.useMutation('post', '/api/helpers');
};

export default postHelperProfile;
