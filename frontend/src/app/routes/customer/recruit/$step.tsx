import { Modal } from '@components';
import { PageLayout } from '@layouts';
import { recruitStepSearchSchema, type RecruitFormValues } from '@customer/types';
import { useFunnel, useModal } from '@hooks';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Profile,
  Condition,
  Communication,
  Time,
  EscortRoute,
  SearchRoute,
  Request,
  Final,
} from '@customer/components';

export const Route = createFileRoute('/customer/recruit/$step')({
  validateSearch: recruitStepSearchSchema,
  beforeLoad: async ({ search }) => {
    const { place } = search;
    if (place && !(place === 'meeting' || place === 'hospital' || place === 'return')) {
      throw redirect({
        to: '/customer',
      });
    }
  },
  component: RouteComponent,
});

const stepList = ['profile', 'condition', 'communication', 'time', 'route', 'request', 'final'];

function RouteComponent() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const methods = useForm<RecruitFormValues>({ shouldUnregister: false });

  const { Funnel, Step, nextStep, currentStep, handleBackStep } = useFunnel({
    defaultStep: 'profile',
    basePath: 'customer/recruit',
    paramPath: '/customer/recruit/$step',
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
    <>
      <PageLayout.Header
        title='동행 신청하기'
        showBack={currentStep.includes('searchRoute')}
        showClose={true}
        onClose={handleClose}
        background={currentStep === 'final' ? false : true}
        showProgress={currentStep !== 'final' && !currentStep.includes('searchRoute')}
        currentStep={stepList.indexOf(currentStep) + 1}
        maxStep={stepList.length - 1}
      />
      <PageLayout.Content>
        <FormProvider {...methods}>
          <Funnel>
            <Step name='profile'>
              <Profile handleNextStep={nextStep} />
            </Step>
            <Step name='condition'>
              <Condition handleNextStep={nextStep} handleBackStep={handleBackStep} />
            </Step>
            <Step name='communication'>
              <Communication handleNextStep={nextStep} handleBackStep={handleBackStep} />
            </Step>
            <Step name='time'>
              <Time handleNextStep={nextStep} handleBackStep={handleBackStep} />
            </Step>
            <Step name='route'>
              <EscortRoute handleNextStep={nextStep} handleBackStep={handleBackStep} />
            </Step>
            <Step name='searchRoute'>
              <SearchRoute handleSelectRoute={handleBackStep} />
            </Step>
            <Step name='request'>
              <Request handleNextStep={nextStep} handleBackStep={handleBackStep} />
            </Step>
            <Step name='final'>
              <Final handleBackStep={handleBackStep} />
            </Step>
          </Funnel>
        </FormProvider>
      </PageLayout.Content>

      <Modal isOpen={isOpen} onClose={handleDenyClose}>
        <Modal.Title>동행 신청을 중단하시겠어요?</Modal.Title>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={handleApproveClose}>네</Modal.ConfirmButton>
          <Modal.CloseButton onClick={handleDenyClose}>아니오</Modal.CloseButton>
        </Modal.ButtonContainer>
      </Modal>
    </>
  );
}
