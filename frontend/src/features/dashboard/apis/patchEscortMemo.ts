import { $api } from '@shared/apis';

const patchEscortMemo = () => {
  return $api.useMutation('patch', '/api/escorts/{escortId}/memo');
};

export default patchEscortMemo;
