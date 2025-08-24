import { $api } from '@shared/api';

const getPastPatientInfo = () => {
  return $api.useQuery('get', '/api/recruits/patients');
};

export default getPastPatientInfo;
