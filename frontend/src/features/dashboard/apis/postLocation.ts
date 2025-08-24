import { $api } from '@shared/api';

const postLocation = async () => {
  return $api.useMutation('post', '/api/realtime/escorts/{escortId}/locations');
};

export default postLocation;
