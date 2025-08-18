import { $api } from '@apis';

const getEscortDetail = (escortId: number) => {
  return $api.useSuspenseQuery(
    'get',
    '/api/escorts/recruits/{recruitId}',
    {
      params: {
        path: {
          recruitId: escortId,
        },
      },
    },
    {
      staleTime: Infinity,
      gcTime: Infinity,
    }
  );
};

export default getEscortDetail;
