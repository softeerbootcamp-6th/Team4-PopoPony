import { $api } from '@shared/apis';

const postReport = () => {
  return $api.useMutation('post', '/api/reports/recruits/{recruitId}');
};

export default postReport;
