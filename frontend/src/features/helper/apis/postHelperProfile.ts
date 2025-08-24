import { $api } from '@shared/api';

const postHelperProfile = () => {
  return $api.useMutation('post', '/api/helpers');
};

export default postHelperProfile;
