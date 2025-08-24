import { $api } from '@apis';

const getRecruitById = (recruitId: number) => {
  return $api.useQuery('get', '/api/recruits/{recruitId}', {
    params: {
      path: {
        recruitId,
      },
    },
  });
};

export default getRecruitById;
