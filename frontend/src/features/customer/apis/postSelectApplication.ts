import { $api } from '@apis';

const postSelectApplication = () => {
  return $api.useMutation('post', '/api/applications/{applicationId}/select');
};

export default postSelectApplication;
