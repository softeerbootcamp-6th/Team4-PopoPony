import { $api } from '@shared/api';

const getRecruitPayment = (recruitId: number) => {
  return $api.useSuspenseQuery('get', '/api/recruits/{recruitId}/payments', {
    params: {
      path: {
        recruitId: Number(recruitId),
      },
    },
  });
};

export default getRecruitPayment;
