import { $api } from '@shared/api';

const getApplicationListById = (recruitId: number) => {
  return $api.useSuspenseQuery(
    'get',
    '/api/applications/recruits/{recruitId}',
    {
      params: {
        path: { recruitId },
      },
    },
    {
      staleTime: 30_000,
      gcTime: 300_000,
    }
  );
};

export default getApplicationListById;
