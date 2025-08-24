import { type RecruitStepProps } from '@customer/types';
import { useFormContext } from 'react-hook-form';
import { useFormValidation } from '@shared/hooks';
import { reviewSchema } from '@customer/types';
import { FormLayout } from '@shared/ui/layout';
import { FormTextarea } from '@shared/ui';
import { postHelperReview } from '@customer/apis';
import { getRouteApi } from '@tanstack/react-router';

interface CommentProps extends RecruitStepProps {
  escortId: string;
  handleNextStep: () => void;
}

const routeApi = getRouteApi('/customer/escort/$escortId/$helperId/review/$step');

const Comment = ({ escortId, handleNextStep }: CommentProps) => {
  const { getValues } = useFormContext();
  const { helperId } = routeApi.useParams();
  const { isFormValid } = useFormValidation(reviewSchema);
  const { mutate } = postHelperReview();

  const handleClickNext = () => {
    mutate(
      {
        params: {
          path: {
            recruitId: Number(escortId),
          },
        },
        body: {
          helperId: Number(helperId),
          recruitId: Number(escortId),
          satisfactionLevel: getValues('satisfactionLevel'),
          satisfactionComment: getValues('satisfactionComment'),
          positiveFeedbackList: getValues('detailComment'),
          shortComment: getValues('reviewComment'),
        },
      },
      {
        onSuccess: () => {
          handleNextStep();
        },
      }
    );
  };

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
        <FormLayout.FooterPrevNext
          handleClickNext={handleClickNext}
          disabled={!isFormValid}
          nextButtonText='완료'
        />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Comment;
