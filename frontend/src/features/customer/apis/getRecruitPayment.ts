import { $api } from '@apis';

const getRecruitPayment = (recruitId: number) => {
  return $api.useQuery('get', '/api/recruits/{recruitId}/payments', {
    params: {
      path: {
        recruitId: Number(recruitId),
      },
    },
  });
};

export default getRecruitPayment;
