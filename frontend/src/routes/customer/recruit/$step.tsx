import { TwoOptionSelector, ProgressBar } from '@components';
import { PageLayout } from '@layouts';
import { type RecruitFormValues } from '@customer/types';
import { useFunnel } from '@hooks';
import { createFileRoute } from '@tanstack/react-router';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { Step1 } from '@customer/components';

export const Route = createFileRoute('/customer/recruit/$step')({
  component: RouteComponent,
});

const stepList = ['기본정보', '보행상태', '의사소통', '동행시간', '동행경로', '요청사항'];

function RouteComponent() {
  const methods = useForm<RecruitFormValues>({ shouldUnregister: false });

  const onSubmit: SubmitHandler<RecruitFormValues> = (data) => {
    console.log('Final Data:', data);
  };

  const { Funnel, Step, nextStep, currentStep } = useFunnel({
    defaultStep: '기본정보',
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

  // // Footer 버튼 텍스트 결정
  // const getButtonLabel = () => {
  //   const currentIndex = stepList.indexOf(currentStep);
  //   return currentIndex === stepList.length - 1 ? '제출' : '다음';
  // };

  return (
    <PageLayout>
      <PageLayout.Header
        title='동행 신청하기'
        showBack={currentStep !== '기본정보'}
        showClose={true}
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
                <Step name='기본정보'>
                  <Step1 handleNextStep={handleNextStep} />
                </Step>
                <Step name='보행상태'>
                  <div>step2</div>
                  <TwoOptionSelector
                    name='needsPhysicalSupport'
                    leftOption={{ label: '필요해요', value: true }}
                    rightOption={{ label: '필요없어요', value: false }}
                  />
                  <TwoOptionSelector
                    name='usesWheelchair'
                    leftOption={{ label: '이용하고 있어요', value: true }}
                    rightOption={{ label: '이용하지 않아요', value: false }}
                  />
                </Step>
                <Step name='의사소통'>
                  <div>step3</div>
                  <TwoOptionSelector
                    name='communicationAbility'
                    leftOption={{ label: '왼쪽', value: 'step3-left' }}
                    rightOption={{ label: '오른쪽', value: 'step3-right' }}
                  />
                </Step>

                <Step name='step4'>
                  <div>마지막</div>
                </Step>
              </Funnel>
            </FormProvider>
          </div>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
