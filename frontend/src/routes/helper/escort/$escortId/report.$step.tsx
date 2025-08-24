import { createFileRoute, useRouter } from '@tanstack/react-router';

import { useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import { useFunnel, useModal } from '@shared/hooks';
import { dateFormat } from '@shared/lib';
import { Modal } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';

import { getReportDefault } from '@helper/apis';
import { ReportDetail, Reservation, Taxi, Time } from '@helper/components';
import type { ReportFormValues } from '@helper/types';

export const Route = createFileRoute('/helper/escort/$escortId/report/$step')({
  component: RouteComponent,
});

const stepList = ['time', 'reservation', 'taxi', 'detail'];

function RouteComponent() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const methods = useForm<ReportFormValues>();
  const { escortId } = Route.useParams();

  const { data: reportDefaultResponse } = getReportDefault(Number(escortId));
  const reportDefault = reportDefaultResponse?.data;

  useEffect(() => {
    if (reportDefault) {
      methods.reset({
        actualMeetingTime: `${dateFormat(reportDefault.actualMeetingTime, 'HH:mm')}` || '',
        actualReturnTime: `${dateFormat(reportDefault.actualReturnTime, 'HH:mm')}` || '',
        hasNextAppointment: true,
        nextAppointmentTime: undefined,
        description: reportDefault.memo || '',
        imageCreateRequestList: [],
        taxiFeeCreateRequest: {
          departureFee: '',
          departureReceipt: {} as ReportFormValues['taxiFeeCreateRequest']['departureReceipt'],
          returnFee: '',
          returnReceipt: {} as ReportFormValues['taxiFeeCreateRequest']['returnReceipt'],
        },
      });
    }
  }, [reportDefault, methods]);

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
    router.navigate({ to: '/helper' });
  };

  const handleDenyClose = () => {
    closeModal();
  };

  return (
    <>
      <PageLayout.Header
        title='동행 리포트 작성'
        showBack={currentStep.includes('searchRoute')}
        showClose={true}
        onClose={handleClose}
        showProgress={currentStep !== 'final' && !currentStep.includes('searchRoute')}
        currentStep={stepList.indexOf(currentStep) + 1}
        maxStep={stepList.length}
      />
      <PageLayout.Content>
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
              <ReportDetail />
            </Step>
          </Funnel>
        </FormProvider>
      </PageLayout.Content>

      <Modal isOpen={isOpen} onClose={handleDenyClose}>
        <Modal.Title>리포트는 3시간 내로 반드시 작성해주세요.</Modal.Title>
        <Modal.Content>동행 리포트를 작성하지 않으면 정산이 불가능합니다.</Modal.Content>
        <Modal.ButtonContainer>
          <Modal.ConfirmButton onClick={handleApproveClose}>확인</Modal.ConfirmButton>
        </Modal.ButtonContainer>
      </Modal>
    </>
  );
}
