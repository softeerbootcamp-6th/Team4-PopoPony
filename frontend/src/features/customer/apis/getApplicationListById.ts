import { $api } from '@shared/apis';

const getApplicationListById = (recruitId: number) => {
  return $api.useQuery('get', '/api/applications/recruits/{recruitId}', {
    params: {
      path: { recruitId },
    },
  });
};

export default getApplicationListById;
