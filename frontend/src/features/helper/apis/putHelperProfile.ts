import { $api } from '@apis';

const putHelperProfile = () => {
  return $api.useMutation('put', '/api/helpers/{helperProfileId}/updates');
};

export default putHelperProfile;
