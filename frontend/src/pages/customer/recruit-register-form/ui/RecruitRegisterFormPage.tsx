import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { FormProvider, useForm } from 'react-hook-form';

import { useFunnel, useModal } from '@shared/hooks';
import { Modal } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';

import {
  Communication,
  Condition,
  EscortRoute,
  Final,
  Profile,
  Request,
  SearchRoute,
  Time,
} from '@customer/components';
import { type RecruitFormValues } from '@customer/types';

const stepList = ['profile', 'condition', 'communication', 'time', 'route', 'request', 'final'];

const RecruitRegisterFormPage = () => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const methods = useForm<RecruitFormValues>({ shouldUnregister: false });
  const queryClient = useQueryClient();
  queryClient.setQueryData(['recruitFormStarted'], true);

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
        background={true}
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
};

export default RecruitRegisterFormPage;
