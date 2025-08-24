import { $api } from '@shared/apis';

const getRecruitsById = (recruitId: number) => {
  return $api.useQuery('get', '/api/recruits/{recruitId}', {
    params: {
      path: {
        recruitId,
      },
    },
  });
};

export default getRecruitsById;
