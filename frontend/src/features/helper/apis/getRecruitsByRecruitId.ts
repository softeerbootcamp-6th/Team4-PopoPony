import { $api } from '@shared/apis';

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
