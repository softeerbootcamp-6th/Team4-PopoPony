import { $api } from '@apis';

const getRecruitsCustomer = () => {
  return $api.useQuery('get', '/api/recruits/customer', {
    params: {
      query: {
        auth: {},
      },
    },
  });
};

export default getRecruitsCustomer;
