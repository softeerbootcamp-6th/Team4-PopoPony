import { $api } from '@shared/apis';

const getRecruitReviewByRecruitId = (recruitId: number, enabled: boolean) => {
  return $api.useQuery('get', '/api/reviews/recruits/{recruitId}', {
    params: {
      path: {
        recruitId: Number(recruitId),
      },
    },
    enabled: enabled,
  });
};

export default getRecruitReviewByRecruitId;
