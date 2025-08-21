import { $api } from '@apis';

const patchEscortMemo = () => {
  return $api.useMutation('patch', '/api/escorts/{escortId}/memo');
};

export default patchEscortMemo;
