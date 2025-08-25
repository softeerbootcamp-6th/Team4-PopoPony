import { $api } from '@shared/api';

const postSelectApplication = () => {
  return $api.useMutation('post', '/api/applications/{applicationId}/select');
};

export default postSelectApplication;
