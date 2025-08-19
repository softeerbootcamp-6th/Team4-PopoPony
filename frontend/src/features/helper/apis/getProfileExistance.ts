import { $api } from '@apis';

const getProfileExistance = (enable = true) => {
  return $api.useQuery('get', '/api/helpers/existence', {
    enabled: enable,
  });
};

export default getProfileExistance;
