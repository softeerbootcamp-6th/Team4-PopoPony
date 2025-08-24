import { FormLayout } from '@shared/layouts';
import { MultiImageSelect } from '@helper/components';
import { useFormContext, useWatch } from 'react-hook-form';
import { cn } from '@/shared/libs/utils';
import { Modal } from '@shared/components';
import { useModal } from '@shared/hooks';
import type { ReportFormValues } from '@helper/types';
import { convertFormToApiRequest } from '@helper/utils';
import { postReport } from '@helper/apis';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

const Route = getRouteApi('/helper/escort/$escortId/report/$step');

const ReportDetail = () => {
  const { register, control, handleSubmit } = useFormContext<ReportFormValues>();
  const { isOpen, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const { escortId } = Route.useParams();
  const { mutate } = postReport();

  const description = useWatch({
    control,
    name: 'description',
  });

  const isValid = description && description.length >= 5;

  const getErrorMessage = () => {
    if (description && description.length < 5) {
      return '동행 보고서는 5글자 이상 작성해주세요.';
    }
    return '';
  };

  const handleSubmitReport = (data: ReportFormValues) => {
    const apiRequest = convertFormToApiRequest(data);

    mutate(
      {
        params: {
          path: {
            recruitId: Number(escortId),
          },
        },
        body: apiRequest,
      },
      {
        onSuccess: () => {
          navigate({
            to: '/helper/escort/$escortId/report/completed',
            params: {
              escortId: escortId,
            },
          });
        },
        onError: () => {
          alert('리포트 전달에 실패했어요. 다시 시도해주세요.');
        },
      }
    );
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>동행 보고서를 작성해주세요</FormLayout.Title>
          <FormLayout.SubTitle>
            보호자에게 전달할 상세한 내용을 작성하고 사진을 첨부해주세요.
          </FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <div>
          <textarea
            placeholder={`상세하게 내용을 입력해주세요.\nex. 병원 진료 내용 / 약국 복약지도 내용 / 진행 중 발생한 특이사항 등 `}
            className={cn(
              'border-stroke-neutral-dark bg-background-default-white body1-16-medium placeholder:text-text-neutral-assistive focus:border-neutral-80 min-h-[14rem] w-full resize-none rounded-[0.6rem] border px-[1.2rem] py-[1rem] break-keep transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50'
            )}
            {...register('description')}
          />
          {getErrorMessage() && (
            <p className='text-text-red-primary body2-14-medium'>{getErrorMessage()}</p>
          )}
        </div>

        <MultiImageSelect
          name='imageCreateRequestList'
          prefix='uploads/report'
          maxImageLength={2}
        />
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext
          handleClickNext={openModal}
          disabled={!isValid}
          nextButtonText='완료'
        />
      </FormLayout.Footer>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <Modal.Title>리포트를 전달하시겠어요?</Modal.Title>
        <Modal.Content>동행리포트는 수정할 수 없으며 전달 즉시 동행은 마무리돼요.</Modal.Content>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={handleSubmit(handleSubmitReport)}>
            전달하기
          </Modal.ConfirmButton>
          <Modal.CloseButton onClick={closeModal}>취소</Modal.CloseButton>
        </Modal.ButtonContainer>
      </Modal>
    </FormLayout>
  );
};

export default ReportDetail;
