import { $api } from '@apis';

const getRecruitReviewByRecruitId = (recruitId: number) => {
  return $api.useQuery(
    'get',
    '/api/reports/recruits/{recruitId}',
    {
      params: {
        path: {
          recruitId: Number(recruitId),
        },
      },
    },
    { throwOnError: false, staleTime: 30_000, gcTime: 300_000 }
  );
};

export default getRecruitReviewByRecruitId;
