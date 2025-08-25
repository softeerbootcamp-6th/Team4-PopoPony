import { $api } from '@shared/api';

const getRecruitById = (recruitId: number) => {
  return $api.useQuery(
    'get',
    '/api/recruits/{recruitId}',
    {
      params: {
        path: {
          recruitId,
        },
      },
    },
    {
      staleTime: 30_000,
      gcTime: 300_000,
    }
  );
};

export default getRecruitById;
