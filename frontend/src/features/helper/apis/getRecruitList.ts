import { $api } from '@shared/api';

const getRecruitList = () => {
  return $api.useQuery('get', '/api/recruits/helper');
};

export default getRecruitList;
