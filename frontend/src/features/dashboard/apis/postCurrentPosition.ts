import { $api } from '@shared/apis';

const postCurrentPosition = () => {
  return $api.useMutation('post', '/api/realtime/escorts/{escortId}/locations');
};

export default postCurrentPosition;
