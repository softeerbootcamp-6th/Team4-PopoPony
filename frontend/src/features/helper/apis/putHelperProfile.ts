import { $api } from '@shared/apis';

const putHelperProfile = () => {
  return $api.useMutation('put', '/api/helpers/{helperProfileId}/updates');
};

export default putHelperProfile;
