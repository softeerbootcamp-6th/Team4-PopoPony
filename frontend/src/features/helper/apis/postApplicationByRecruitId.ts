import { $api } from '@shared/apis';

const postApplicationByRecruitId = () => {
  return $api.useMutation('post', '/api/applications/recruits/{recruitId}');
};

export default postApplicationByRecruitId;
