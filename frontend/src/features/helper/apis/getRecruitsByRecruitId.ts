import { $api } from '@shared/api';

const getRecruitsByRecruitId = (recruitId: number) => {
  return $api.useQuery('get', '/api/recruits/{recruitId}', {
    params: {
      path: {
        recruitId: recruitId,
      },
    },
  });
};

export default getRecruitsByRecruitId;
