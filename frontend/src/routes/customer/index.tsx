import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Button, Tabs } from '@components';
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

        <Tabs defaultValue='신청'>
          <Tabs.TabsList>
            <Tabs.TabsTrigger value='신청'>
              신청
              <span className='group-data-[state=active]:text-text-mint-primary'>5</span>
            </Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='완료'>
              완료
              <span className='group-data-[state=active]:text-text-mint-primary'>3</span>
            </Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='신청'>Make changes to your 신청 here.</Tabs.TabsContent>
          <Tabs.TabsContent value='완료'>Change your 완료 here.</Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
    </PageLayout>
  );
}
