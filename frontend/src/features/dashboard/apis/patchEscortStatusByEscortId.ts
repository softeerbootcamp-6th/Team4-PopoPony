import { $api } from '@apis';

const patchEscortStatusByEscortId = async () => {
  return $api.useMutation('patch', '/api/escorts/{escortId}/status');
};

export default patchEscortStatusByEscortId;
