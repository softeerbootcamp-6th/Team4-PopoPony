import { $api } from '@apis';

const getPastPatientInfo = () => {
  return $api.useQuery('get', '/api/recruits/patients');
};

export default getPastPatientInfo;
