import { $api } from '@apis';

const getProfileExistance = () => {
  return $api.useQuery('get', '/api/helpers/existence');
};

export default getProfileExistance;
