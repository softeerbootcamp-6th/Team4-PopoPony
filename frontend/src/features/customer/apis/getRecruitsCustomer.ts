import { $api } from '@apis';

const getRecruitsCustomer = () => {
  return $api.useQuery('get', '/api/recruits/customer', { throwOnError: true });
};

export default getRecruitsCustomer;
