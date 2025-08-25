import { $api } from '@shared/api';

const getRecruitReviewByRecruitId = (recruitId: number, enabled: boolean) => {
  return $api.useQuery(
    'get',
    '/api/reviews/recruits/{recruitId}',
    {
      params: {
        path: {
          recruitId: Number(recruitId),
        },
      },
      enabled: enabled,
    },
    { throwOnError: false, staleTime: 30_000, gcTime: 300_000 }
  );
};

export default getRecruitReviewByRecruitId;
