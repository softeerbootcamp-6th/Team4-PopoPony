import { $api } from '@shared/apis';

const patchCancelRecruit = () => {
  return $api.useMutation('patch', '/api/recruits/{recruitId}/cancel');
};

export default patchCancelRecruit;
