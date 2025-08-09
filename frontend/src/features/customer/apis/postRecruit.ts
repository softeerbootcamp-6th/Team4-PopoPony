import { $api } from '@apis';

const postRecruit = () => {
  return $api.useMutation('post', '/api/recruits');
};

export default postRecruit;
