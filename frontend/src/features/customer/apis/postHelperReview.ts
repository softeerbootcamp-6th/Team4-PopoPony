import { $api } from '@shared/apis';

const postHelperReview = () => {
  return $api.useMutation('post', '/api/reviews/recruits/{recruitId}');
};

export default postHelperReview;
