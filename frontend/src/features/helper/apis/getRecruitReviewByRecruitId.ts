import { $api } from '@shared/api';

const getRecruitReviewByRecruitId = (recruitId: number, isReviewEnabled: boolean) => {
  return $api.useQuery(
    'get',
    '/api/reviews/recruits/{recruitId}',
    {
      params: { path: { recruitId } },
      enabled: isReviewEnabled,
    },
    { throwOnError: false }
  );
};

export default getRecruitReviewByRecruitId;
