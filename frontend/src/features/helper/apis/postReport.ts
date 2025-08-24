import { $api } from '@shared/api';

const postReport = () => {
  return $api.useMutation('post', '/api/reports/recruits/{recruitId}');
};

export default postReport;
