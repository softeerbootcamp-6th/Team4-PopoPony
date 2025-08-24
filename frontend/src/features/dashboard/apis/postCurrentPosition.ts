import { $api } from '@shared/api';

const postCurrentPosition = () => {
  return $api.useMutation('post', '/api/realtime/escorts/{escortId}/locations');
};

export default postCurrentPosition;
