import { $api } from '@apis';

const patchEscortStatusByEscortId = () => {
  return $api.useMutation('patch', '/api/escorts/{escortId}/status');
};

export default patchEscortStatusByEscortId;
