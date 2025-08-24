import { $api } from '@shared/apis';

const postHelperProfile = () => {
  return $api.useMutation('post', '/api/helpers');
};

export default postHelperProfile;
