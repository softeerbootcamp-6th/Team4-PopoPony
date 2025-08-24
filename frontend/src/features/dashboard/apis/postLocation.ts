import { $api } from '@shared/apis';

const postLocation = async () => {
  return $api.useMutation('post', '/api/realtime/escorts/{escortId}/locations');
};

export default postLocation;
