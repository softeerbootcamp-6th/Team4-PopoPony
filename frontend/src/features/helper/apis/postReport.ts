import { $api } from '@apis';

const postReport = () => {
  return $api.useMutation('post', '/api/reports/recruits/{recruitId}');
};

export default postReport;
