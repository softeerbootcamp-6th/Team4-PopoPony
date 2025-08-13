import { type RecruitStepProps } from '@customer/types';
import { useFormContext } from 'react-hook-form';
import { useFormValidation } from '@hooks';
import { reviewSchema } from '@customer/types';
import { FormLayout } from '@layouts';
import { FormTextarea } from '@components';
import { postHelperReview } from '@customer/apis';
import { useParams } from '@tanstack/react-router';

interface CommentProps extends RecruitStepProps {
  escortId: string;
  handleNextStep: () => void;
}

const Comment = ({ escortId, handleNextStep }: CommentProps) => {
  const { getValues } = useFormContext();
  const { helperId } = useParams({
    from: '/customer/escort/$escortId/$helperId/review/$step',
  });
  const { values, isFormValid } = useFormValidation(reviewSchema);
  const { mutate } = postHelperReview();

  const handleClickNext = () => {
    mutate(
      {
        params: {
          path: {
            recruitId: Number(escortId),
          },
          query: {
            request: {
              helperId: Number(helperId),
              recruitId: Number(escortId),
              satisfactionLevel: getValues('satisfactionLevel'),
              satisfactionComment: getValues('satisfactionComment'),
              positiveFeedbackList: getValues('detailComment'),
              shortComment: getValues('reviewComment'),
            },
          },
        },
      },
      {
        onSuccess: () => {
          alert('후기가 등록되었어요!');
          handleNextStep();
        },
        onError: () => {
          alert('후기 등록에 실패했어요. 다시 시도해주세요.');
        },
      }
    );
  };

  //   body: {
  //     helperId: Number(helperId),
  //     satisfactionLevel: getValues('satisfactionLevel'),
  //     satisfactionComment: getValues('satisfactionComment'),
  //     detailComment: getValues('detailComment'),
  //     reviewComment: getValues('reviewComment'),
  //   },

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>한줄평을 남겨주세요</FormLayout.Title>
          <FormLayout.SubTitle>도우미와 동행서비스에 대해 말해주세요.</FormLayout.SubTitle>
        </FormLayout.TitleWrapper>

        <FormTextarea name='reviewComment' placeholder='최소 5자 이상 작성해주세요.' rows={5} />
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleClickNext} disabled={!isFormValid} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Comment;
