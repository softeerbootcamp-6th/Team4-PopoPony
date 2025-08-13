import { Modal, ProgressBar } from '@components';
import { ReportDetail, Reservation, Taxi, Time } from '@helper/components';
import { useFunnel, useModal } from '@hooks';
import { PageLayout } from '@layouts';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';

export const Route = createFileRoute('/helper/escort/$escortId/report/$step')({
  component: RouteComponent,
});

const stepList = ['time', 'reservation', 'taxi', 'detail'];

function RouteComponent() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const methods = useForm({ shouldUnregister: false });

  const { Funnel, Step, nextStep, currentStep, handleBackStep } = useFunnel({
    defaultStep: 'time',
    basePath: 'helper/escort/$escortId/report',
    paramPath: '/helper/escort/$escortId/report/$step',
    stepList: stepList,
  });

  const handleClose = () => {
    openModal();
  };

  const handleApproveClose = () => {
    closeModal();
    router.navigate({ to: '/customer' });
  };

  const handleDenyClose = () => {
    closeModal();
  };

  return (
    <PageLayout>
      <PageLayout.Header
        title='동행 리포트 작성'
        showBack={currentStep.includes('searchRoute')}
        showClose={true}
        onClose={handleClose}
      />
      <PageLayout.Content>
        <div className='flex h-full flex-col'>
          {currentStep !== 'final' && !currentStep.includes('searchRoute') ? (
            <div className='flex-shrink-0 px-[2rem] pb-[2rem]'>
              <ProgressBar
                maxStep={stepList.length}
                currentStep={stepList.indexOf(currentStep) + 1}
              />
            </div>
          ) : null}
          <div className='flex-1 overflow-hidden'>
            <FormProvider {...methods}>
              <Funnel>
                <Step name='time'>
                  <Time handleNextStep={nextStep} />
                </Step>
                <Step name='reservation'>
                  <Reservation handleNextStep={nextStep} handleBackStep={handleBackStep} />
                </Step>
                <Step name='taxi'>
                  <Taxi handleNextStep={nextStep} handleBackStep={handleBackStep} />
                </Step>
                <Step name='detail'>
                  <ReportDetail handleNextStep={nextStep} handleBackStep={handleBackStep} />
                </Step>
              </Funnel>
            </FormProvider>
          </div>
        </div>
      </PageLayout.Content>

      <Modal isOpen={isOpen} onClose={handleDenyClose}>
        <Modal.Title>리포트는 3시간 내로 반드시 작성해주세요.</Modal.Title>
        <Modal.Content>동행 리포트를 작성하지 않으면 정산이 불가능합니다.</Modal.Content>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={handleApproveClose}>확인</Modal.ConfirmButton>
        </Modal.ButtonContainer>
      </Modal>
    </PageLayout>
  );
}
