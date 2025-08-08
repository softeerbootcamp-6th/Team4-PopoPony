import { ProgressBar, Modal } from '@components';
import { PageLayout } from '@layouts';
import { type ProfileFormValues } from '@helper/types';
import { useFunnel, useModal } from '@hooks';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Region, Detail } from '@helper/components';
import { FormProvider, useForm } from 'react-hook-form';

export const Route = createFileRoute('/helper/profile/new/$step')({
  component: RouteComponent,
});

const stepList = ['region', 'detail'];

function RouteComponent() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const methods = useForm<ProfileFormValues>({ shouldUnregister: false });

  const { Funnel, Step, nextStep, currentStep, handleBackStep } = useFunnel({
    defaultStep: 'region',
    basePath: 'helper/profile/new',
    paramPath: '/helper/profile/new/$step',
    stepList: stepList,
  });

  const handleClose = () => {
    openModal();
  };

  const handleApproveClose = () => {
    closeModal();
    router.navigate({ to: '/helper/profile' });
  };

  const handleDenyClose = () => {
    closeModal();
  };

  return (
    <PageLayout>
      <PageLayout.Header
        title='동행 신청하기'
        showBack={true}
        showClose={true}
        onClose={handleClose}
      />
      <PageLayout.Content>
        <div className='h-full flex-1 overflow-hidden'>
          <FormProvider {...methods}>
            <Funnel>
              <Step name='region'>
                <Region handleNextStep={nextStep} />
              </Step>
              <Step name='detail'>
                <Detail />
              </Step>
            </Funnel>
          </FormProvider>
        </div>
      </PageLayout.Content>
      <Modal isOpen={isOpen} onClose={handleDenyClose}>
        <Modal.Title>프로필 작성을 중단하시겠어요?</Modal.Title>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={handleApproveClose}>네</Modal.ConfirmButton>
          <Modal.CloseButton onClick={handleDenyClose}>아니오</Modal.CloseButton>
        </Modal.ButtonContainer>
      </Modal>
    </PageLayout>
  );
}
