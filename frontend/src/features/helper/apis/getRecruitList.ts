import { $api } from '@shared/apis';

const getRecruitList = () => {
  return $api.useQuery('get', '/api/recruits/helper');
};

export default getRecruitList;
