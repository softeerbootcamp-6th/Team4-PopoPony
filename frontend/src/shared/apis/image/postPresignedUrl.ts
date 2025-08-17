import { $api } from '../client';

const postPresignedUrl = () => {
  return $api.useMutation('post', '/api/images/presigned');
};

export default postPresignedUrl;
