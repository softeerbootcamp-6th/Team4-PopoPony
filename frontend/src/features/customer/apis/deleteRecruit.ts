import { $api } from '@shared/apis';

const deleteRecruit = () => {
  return $api.useMutation('patch', '/api/recruits/{recruitId}/cancel');
};

export default deleteRecruit;
