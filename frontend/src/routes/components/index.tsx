import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  ButtonCTA,
  LabeledSection,
  TwoOptionSelector,
  TextField,
  ProgressBar,
} from '@components';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import type { HTMLAttributes } from 'react';

export const Route = createFileRoute('/components/')({
  component: RouteComponent,
});

type FormValues = {
  cognitive: string;
};

function RouteComponent() {
  const methods = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Final Data:', data);
  };

  interface SectionProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
  }

  const Section = ({ title, children, className }: SectionProps) => {
    return (
      <div className={`flex w-[33.5rem] flex-col gap-[1.6rem] ${className}`}>
        <h3 className='text-neutral-90 title-20-bold mb-[1.6rem]'>{title}</h3>
        {children}
      </div>
    );
  };

  return (
    <div className='absolute inset-0 flex flex-wrap gap-[4rem] p-[4rem]'>
      <Section title='Button'>
        <div className='flex flex-col gap-[1.6rem]'>
          <Button variant='primary' size='sm'>
            primary sm
          </Button>
          <Button variant='primary' size='md'>
            primary md
          </Button>
          <Button variant='primary' size='lg'>
            primary lg
          </Button>
          <Button variant='secondary' size='sm'>
            secondary sm
          </Button>
          <Button variant='secondary' size='md'>
            secondary md
          </Button>
          <Button variant='secondary' size='lg'>
            secondary lg
          </Button>
          <Button variant='assistive' size='sm'>
            assistive sm
          </Button>
          <Button variant='assistive' size='md'>
            assistive md
          </Button>
          <Button variant='assistive' size='lg'>
            assistive lg
          </Button>
          <Button variant='primary' size='sm' isLoading>
            primary sm
          </Button>
          <Button variant='secondary' size='md' isLoading>
            secondary md
          </Button>
          <Button variant='secondary' size='lg' isLoading>
            secondary lg
          </Button>
        </div>
      </Section>

      <Section title='LabeledSection/TwoOptionSelector'>
        <FormProvider {...methods}>
          <LabeledSection label='인지능력' isChecked={!!methods.watch('cognitive')}>
            <TwoOptionSelector
              name='cognitive'
              leftOption={{ label: '괜찮아요', value: 'ok' }}
              rightOption={{ label: '도움이 필요해요', value: 'help' }}
            />
          </LabeledSection>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Button type='submit'>Submit</Button>
          </form>
        </FormProvider>
      </Section>

      <Section title='ProgressBar'>
        <ProgressBar maxStep={3} currentStep={1} />
        <ProgressBar maxStep={3} currentStep={2} />
        <ProgressBar maxStep={3} currentStep={3} />
        <ProgressBar maxStep={4} currentStep={1} />
      </Section>

      {/* TextField Section */}
      <Section title='TextField'>
        <div className='flex w-[32rem] flex-col gap-[2.4rem]'>
          {/* Text Type - Size Variants */}
          <div className='space-y-[1.2rem]'>
            <h4 className='text-neutral-80 body-16-medium'>Text Type</h4>
            <TextField
              size='S'
              type='text'
              label='환자 나이 (Size S)'
              placeholder='나이를 입력하세요'
            />
            <TextField
              size='M'
              type='text'
              label='환자 나이 (Size M)'
              placeholder='나이를 입력하세요'
            />
            <TextField size='M' type='text' label='입력된 상태' value='입력된 텍스트' />
          </div>

          {/* Unit Type */}
          <div className='space-y-[1.2rem]'>
            <h4 className='text-neutral-80 body-16-medium'>Unit Type</h4>
            <TextField size='S' type='unit' unit='세' label='나이 (세 단위)' placeholder='0' />
            <TextField size='M' type='unit' unit='세' label='나이 (세 단위)' value='25' />
            <TextField size='S' type='unit' unit='원' label='금액 (원 단위)' placeholder='0' />
            <TextField size='M' type='unit' unit='원' label='금액 (원 단위)' value='150000' />
          </div>

          {/* File Type */}
          <div className='space-y-[1.2rem]'>
            <h4 className='text-neutral-80 body-16-medium'>File Type</h4>
            <TextField
              size='S'
              type='file'
              label='첨부파일 (Size S)'
              placeholder='파일을 선택하세요'
              onFileSelect={() => alert('파일 선택 클릭됨')}
            />
            <TextField
              size='M'
              type='file'
              label='첨부파일 (Size M)'
              placeholder='파일을 선택하세요'
              onFileSelect={() => alert('파일 선택 클릭됨')}
            />
            <TextField
              size='M'
              type='file'
              label='업로드된 파일'
              value='자격증.jpg'
              onFileSelect={() => alert('파일 재선택 클릭됨')}
            />
          </div>

          {/* Combined Examples */}
          <div className='space-y-[1.2rem]'>
            <h4 className='text-neutral-80 body-16-medium'>Various States</h4>
            <TextField
              size='M'
              type='text'
              label='읽기 전용'
              value='수정할 수 없는 텍스트'
              readOnly
            />
            <TextField
              size='M'
              type='text'
              label='비활성화'
              placeholder='비활성화된 입력'
              disabled
            />
          </div>
        </div>
      </Section>

      {/* ButtonCTA Section */}
      <Section title='ButtonCTA' className='relative w-full max-w-[60rem]'>
        <div className='flex flex-col gap-[3rem]'>
          {/* Single Button */}
          <div className='space-y-[1.2rem]'>
            <h4 className='text-neutral-80 body1-16-medium'>Single Button</h4>
            <ButtonCTA variant='single' text='확인' onClick={() => alert('Single 버튼 클릭됨')} />
          </div>

          {/* Double Button */}
          <div className='space-y-[1.2rem]'>
            <h4 className='text-neutral-80 body1-16-medium'>Double Button</h4>
            <ButtonCTA variant='double' text='다음' onClick={() => alert('Double 버튼 클릭됨')} />
          </div>

          {/* Slide Button */}
          <div className='space-y-[1.2rem]'>
            <h4 className='text-neutral-80 body1-16-medium'>Slide Button</h4>
            <ButtonCTA
              variant='slide'
              text='밀어서 동행 시작'
              onClick={() => alert('슬라이드 완료! 동행을 시작합니다.')}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
