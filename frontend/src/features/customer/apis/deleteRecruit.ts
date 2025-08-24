import { $api } from '@shared/api';

const deleteRecruit = () => {
  return $api.useMutation('patch', '/api/recruits/{recruitId}/cancel');
};

export default deleteRecruit;
