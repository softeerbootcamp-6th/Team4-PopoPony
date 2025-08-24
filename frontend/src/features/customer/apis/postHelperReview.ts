import { $api } from '@shared/api';

const postHelperReview = () => {
  return $api.useMutation('post', '/api/reviews/recruits/{recruitId}');
};

export default postHelperReview;
