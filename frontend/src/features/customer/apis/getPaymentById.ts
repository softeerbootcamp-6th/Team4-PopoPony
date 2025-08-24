import { $api } from '@shared/api';

const getPaymentById = (recruitId: number) => {
  return $api.useQuery('get', '/api/recruits/{recruitId}/payments', {
    params: {
      path: {
        recruitId,
      },
    },
  });
};

export default getPaymentById;
