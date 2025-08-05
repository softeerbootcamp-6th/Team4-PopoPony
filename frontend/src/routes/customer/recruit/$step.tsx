import { TwoOptionSelector, ProgressBar, Modal } from '@components';
import { PageLayout } from '@layouts';
import { type RecruitFormValues } from '@customer/types';
import { useFunnel, useModal } from '@hooks';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { Profile, Condition, Communication, Time } from '@customer/components';

export const Route = createFileRoute('/customer/recruit/$step')({
  component: RouteComponent,
});

const stepList = ['profile', 'condition', 'communication', 'time', 'route', 'request'];

function RouteComponent() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const methods = useForm<RecruitFormValues>({ shouldUnregister: false });

  const onSubmit: SubmitHandler<RecruitFormValues> = (data) => {
    console.log('Final Data:', data);
  };

  const { Funnel, Step, nextStep, currentStep } = useFunnel({
    defaultStep: 'profile',
    basePath: 'customer/recruit',
    paramPath: '/customer/recruit/$step',
  });

  // 다음 스텝으로 이동하는 함수
  const handleNextStep = () => {
    const currentIndex = stepList.indexOf(currentStep);
    if (currentIndex < stepList.length - 1) {
      const nextStepName = stepList[currentIndex + 1];
      nextStep(nextStepName);
    } else {
      // 마지막 스텝에서는 제출
      methods.handleSubmit(onSubmit)();
    }
  };

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

  // // Footer 버튼 텍스트 결정
  // const getButtonLabel = () => {
  //   const currentIndex = stepList.indexOf(currentStep);
  //   return currentIndex === stepList.length - 1 ? '제출' : '다음';
  // };

  return (
    <PageLayout>
      <PageLayout.Header
        title='동행 신청하기'
        showBack={currentStep !== 'profile'}
        showClose={true}
        onClose={handleClose}
        background={true}
      />
      <PageLayout.Content>
        <div className='flex h-full flex-col'>
          <div className='flex-shrink-0 pb-[2rem]'>
            <ProgressBar
              maxStep={stepList.length}
              currentStep={stepList.indexOf(currentStep) + 1}
            />
          </div>
          <div className='flex-1 overflow-hidden'>
            <FormProvider {...methods}>
              <Funnel>
                <Step name='profile'>
                  <Profile handleNextStep={handleNextStep} />
                </Step>
                <Step name='condition'>
                  <Condition handleNextStep={handleNextStep} />
                </Step>
                <Step name='communication'>
                  <Communication handleNextStep={handleNextStep} />
                </Step>
                <Step name='time'>
                  <Time handleNextStep={handleNextStep} />
                </Step>
                <Step name='route'>
                  <div>루트</div>
                  {/* <Route handleNextStep={handleNextStep} /> */}
                </Step>
                <Step name='request'>
                  <div>요청</div>
                  {/* <Request handleNextStep={handleNextStep} /> */}
                </Step>
              </Funnel>
            </FormProvider>
          </div>
        </div>
      </PageLayout.Content>

      <Modal isOpen={isOpen} onClose={handleDenyClose}>
        <Modal.Title>동행 신청을 중단하시겠어요?</Modal.Title>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={handleApproveClose}>네</Modal.ConfirmButton>
          <Modal.CloseButton onClick={handleDenyClose}>아니오</Modal.CloseButton>
        </Modal.ButtonContainer>
      </Modal>
    </PageLayout>
  );
}
