import { $api } from '@shared/api';

const patchEscortStatusByEscortId = () => {
  return $api.useMutation('patch', '/api/escorts/{escortId}/status');
};

export default patchEscortStatusByEscortId;
