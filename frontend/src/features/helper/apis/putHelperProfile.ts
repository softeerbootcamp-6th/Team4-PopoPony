import { $api } from '@shared/api';

const putHelperProfile = () => {
  return $api.useMutation('put', '/api/helpers/{helperProfileId}/updates');
};

export default putHelperProfile;
