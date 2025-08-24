import { $api } from '@shared/api';

const patchEscortMemo = () => {
  return $api.useMutation('patch', '/api/escorts/{escortId}/memo');
};

export default patchEscortMemo;
