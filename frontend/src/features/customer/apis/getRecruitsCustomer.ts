import { $api } from '@apis';

const getRecruitsCustomer = () => {
  return $api.useQuery('get', '/api/recruits/customer');
};

export default getRecruitsCustomer;
