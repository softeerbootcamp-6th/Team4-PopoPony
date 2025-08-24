import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useFunnel, useModal } from '@hooks';
import { PageLayout } from '@layouts';
import { ProgressBar, Modal } from '@components';
import { Summary, Detail, Comment } from '@customer/components';
import { FormProvider, useForm } from 'react-hook-form';
import { type EscortReviewFormValues } from '@customer/types';
import { getApplicationListById } from '@customer/apis';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/customer/escort/$escortId/$helperId/review/$step')({
  component: RouteComponent,
  beforeLoad: async ({ params, context }) => {
    const { step, escortId, helperId } = params;
    const { queryClient } = context as { queryClient: QueryClient };
    if (step !== 'summary') {
      const started = queryClient.getQueryData<boolean>(['reviewFormStarted']);
      if (!started) {
        throw redirect({
          to: '/customer/escort/$escortId/$helperId/review/$step',
          params: { escortId, helperId, step: 'summary' },
        });
      }
    }
  },
});

const stepList = ['summary', 'detail', 'comment'];

function RouteComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  queryClient.setQueryData(['reviewFormStarted'], true);
  const { escortId } = Route.useParams();
  const methods = useForm<EscortReviewFormValues>({ shouldUnregister: false });
  const { isOpen, openModal, closeModal } = useModal();
  const { Funnel, Step, nextStep, currentStep } = useFunnel({
    defaultStep: 'summary',
    basePath: '/customer/escort/$escortId/$helperId/review',
    paramPath: '/customer/escort/$escortId/$helperId/review/$step',
    stepList: stepList,
  });
  const { data: applicationList } = getApplicationListById(Number(escortId));
  const helperName = applicationList?.data.applicationList[0].helper.name || '동행도우미';
  const handleClose = () => {
    openModal();
  };

  const handleApproveClose = () => {
    closeModal();
    router.navigate({ to: '/customer/escort/$escortId', params: { escortId } });
  };

  const handleDenyClose = () => {
    closeModal();
  };
  return (
    <>
      <PageLayout.Header
        title='동행 후기 작성하기'
        showBack={false}
        showClose={true}
        onClose={handleClose}
      />
      <PageLayout.Content>
        <div className='flex h-full flex-col'>
          <div className='flex-shrink-0 px-[2rem] pb-[2rem]'>
            <ProgressBar
              maxStep={stepList.length}
              currentStep={stepList.indexOf(currentStep) + 1}
            />
          </div>

          <div className='flex-1 overflow-hidden'>
            <FormProvider {...methods}>
              <Funnel>
                <Step name='summary'>
                  <Summary name={helperName} handleNextStep={nextStep} />
                </Step>
                <Step name='detail'>
                  <Detail name={helperName} handleNextStep={nextStep} />
                </Step>
                <Step name='comment'>
                  <Comment
                    escortId={escortId}
                    handleNextStep={() => {
                      router.navigate({
                        to: '/customer/escort/$escortId/completed',
                        params: { escortId },
                      });
                    }}
                  />
                </Step>
              </Funnel>
            </FormProvider>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={handleDenyClose}>
          <Modal.Title>후기 작성을 중단하시겠어요?</Modal.Title>
          <Modal.ButtonContainer>
            <Modal.ConfirmButton onClick={handleApproveClose}>예</Modal.ConfirmButton>
            <Modal.CloseButton onClick={handleDenyClose}>아니오</Modal.CloseButton>
          </Modal.ButtonContainer>
        </Modal>
      </PageLayout.Content>
    </>
  );
}
