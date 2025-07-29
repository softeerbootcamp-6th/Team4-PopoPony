import { createFileRoute } from '@tanstack/react-router';
import { Button, LabeledSection, TwoOptionSelector } from '@components';
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
    </div>
  );
}
