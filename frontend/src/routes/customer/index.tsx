import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Button } from '@components';
import { IcPlusSideLeft } from '@icons';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout>
      <PageLayout.Content>
        <div className='bg-neutral-10 relative h-full max-h-[22rem] px-[2rem] py-[1rem] pb-[2rem]'>
          <div className='absolute z-10'>
            <img src='/images/logo-text.svg' alt='logo-text' className='w-[4rem]' />
            <h2 className='headline-24-bold text-text-neutral-primary mt-[2.4rem] mb-[3rem]'>
              토닥과 함께 <br />
              안전하게 동행하세요!
            </h2>
            <Button variant='assistive' size='md'>
              <IcPlusSideLeft />
              <span className='text-text-neutral-primary'>새로운 동행 신청하기</span>
            </Button>
          </div>
          <img
            src='/images/home-graphic.png'
            alt='home'
            className='absolute top-[-4.4rem] right-0 w-[24.8rem]'
          />
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
