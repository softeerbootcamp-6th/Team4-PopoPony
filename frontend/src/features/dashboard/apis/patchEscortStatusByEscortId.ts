import { $api } from '@shared/apis';

const patchEscortStatusByEscortId = () => {
  return $api.useMutation('patch', '/api/escorts/{escortId}/status');
};

export default patchEscortStatusByEscortId;
