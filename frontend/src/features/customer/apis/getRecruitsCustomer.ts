import { $api } from '@shared/api';

const getRecruitsCustomer = () => {
  return $api.useQuery('get', '/api/recruits/customer', undefined, {
    throwOnError: false,
  });
};

export default getRecruitsCustomer;
