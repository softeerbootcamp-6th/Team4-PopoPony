import { $api } from '@shared/apis';

const getProfileExistance = (enable = true) => {
  return $api.useQuery('get', '/api/helpers/existence', {
    enabled: enable,
  });
};

export default getProfileExistance;
