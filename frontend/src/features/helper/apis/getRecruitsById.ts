import { $api } from '@apis';

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
