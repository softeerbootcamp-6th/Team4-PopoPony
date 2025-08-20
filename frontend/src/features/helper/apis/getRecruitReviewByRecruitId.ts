import { $api } from '@apis';

const getRecruitReviewByRecruitId = (recruitId: number, isReviewEnabled: boolean) => {
  return $api.useQuery('get', '/api/reviews/recruits/{recruitId}', {
    params: { path: { recruitId } },
    enabled: isReviewEnabled,
  });
};

export default getRecruitReviewByRecruitId;
