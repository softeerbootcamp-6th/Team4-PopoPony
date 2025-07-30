import { TwoOptionSelector } from '@components';
import { useFunnel } from '@hooks';
import { createFileRoute } from '@tanstack/react-router';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';

export const Route = createFileRoute('/customer/recruit/$recruitStep/')({
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

  const { Funnel, Step, nextStep, currrendStep } = useFunnel(
    'step1',
    'customer/recruit',
    '/customer/recruit/$recruitStep/'
  );

  return (
    <div>
      <h1>앱바/프로그래스바</h1>
      <h2>{`프로그래스 바 ${stepList.indexOf(currrendStep) + 1} / ${stepList.length}`} </h2>
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
    </div>
  );
}
