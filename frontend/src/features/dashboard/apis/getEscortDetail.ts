import { $api } from '@apis';

export const getEscortDetail = (escortId: number) => {
  return $api.useQuery('get', '/api/escorts/recruits/{recruitId}', {
    params: {
      path: {
        recruitId: escortId,
      },
    },
  });
};
