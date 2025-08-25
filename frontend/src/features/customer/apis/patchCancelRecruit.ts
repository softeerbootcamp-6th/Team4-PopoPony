import { $api } from '@shared/api';

const patchCancelRecruit = () => {
  return $api.useMutation('patch', '/api/recruits/{recruitId}/cancel');
};

export default patchCancelRecruit;
