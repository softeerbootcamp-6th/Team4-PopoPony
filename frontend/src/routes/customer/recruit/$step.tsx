import { TwoOptionSelector, ProgressBar } from '@components';
import { useFunnel } from '@hooks';
import { createFileRoute } from '@tanstack/react-router';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';

export const Route = createFileRoute('/customer/recruit/$step')({
  component: RouteComponent,
});

type FormValues = {
  step1: string;
  step2: string;
  step3: string;
  step4: string;
};

const stepList = ['step1', 'step2', 'step3', 'step4'];

function RouteComponent() {
  const methods = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Final Data:', data);
  };

  const { Funnel, Step, nextStep, currentStep } = useFunnel({
    defaultStep: 'step1',
    basePath: 'customer/recruit',
    paramPath: '/customer/recruit/$step',
  });

  return (
    <>
      <ProgressBar maxStep={stepList.length} currentStep={stepList.indexOf(currentStep) + 1} />
      <FormProvider {...methods}>
        <Funnel>
          <Step name='step1'>
            <div>step1</div>
            <TwoOptionSelector
              name='step1'
              leftOption={{ label: '왼쪽', value: 'step1-left' }}
              rightOption={{ label: '오른쪽', value: 'step1-right' }}
            />
            <button onClick={() => nextStep('step2')}>next</button>
          </Step>
          <Step name='step2'>
            <div>step2</div>
            <TwoOptionSelector
              name='step2'
              leftOption={{ label: '왼쪽', value: 'step2-left' }}
              rightOption={{ label: '오른쪽', value: 'step2-right' }}
            />
            <button onClick={() => nextStep('step3')}>next</button>
          </Step>
          <Step name='step3'>
            <div>step3</div>
            <TwoOptionSelector
              name='step3'
              leftOption={{ label: '왼쪽', value: 'step3-left' }}
              rightOption={{ label: '오른쪽', value: 'step3-right' }}
            />
            <button onClick={() => nextStep('step4')}>next</button>
          </Step>
          <Step name='step4'>
            <div>마지막</div>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <button type='submit'>Submit</button>
            </form>
          </Step>
        </Funnel>
      </FormProvider>
    </>
  );
}
