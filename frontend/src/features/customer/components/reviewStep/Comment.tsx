import { type RecruitStepProps } from '@customer/types';

interface CommentProps extends RecruitStepProps {}

const Comment = ({ handleNextStep, handleBackStep }: CommentProps) => {
  return <div>Comment</div>;
};

export default Comment;
