import { $api } from '@shared/apis';

const postSelectApplication = () => {
  return $api.useMutation('post', '/api/applications/{applicationId}/select');
};

export default postSelectApplication;
