import { $api } from '@shared/api';

const getRecruitReviewByRecruitId = (recruitId: number) => {
  return $api.useQuery('get', '/api/reports/recruits/{recruitId}', {
    params: {
      path: {
        recruitId: Number(recruitId),
      },
    },
  });
};

export default getRecruitReviewByRecruitId;
