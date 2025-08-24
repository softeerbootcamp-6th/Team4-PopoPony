import { $api } from '@shared/apis';

const postPresignedUrl = () => {
  return $api.useMutation('post', '/api/images/presigned');
};

export default postPresignedUrl;
