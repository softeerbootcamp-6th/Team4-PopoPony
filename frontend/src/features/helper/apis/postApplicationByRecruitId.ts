import { $api } from '@shared/api';

const postApplicationByRecruitId = () => {
  return $api.useMutation('post', '/api/applications/recruits/{recruitId}');
};

export default postApplicationByRecruitId;
