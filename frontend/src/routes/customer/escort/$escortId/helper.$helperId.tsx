import { Button, Tabs } from '@components';
import { StatsSummaryCard } from '@customer/components';
import { IcPhoneFill } from '@icons';
import { PageLayout } from '@layouts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/helper/$helperId')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout>
      <PageLayout.Header title='도우미' showBack />
      <PageLayout.Content>
        <div className='flex flex-col gap-[0.8rem] px-[2rem] py-[1.6rem]'>
          <div className='flex-start gap-[1.2rem]'>
            <img
              src='/images/default-profile.svg'
              alt='환자 프로필'
              className='h-[5.6rem] w-[5.6rem] object-cover'
            />
            <div className='flex-col gap-[0.4rem]'>
              <div>
                <span className='subtitle-18-bold text-text-neutral-primary'>김토닥 환자</span>
                <span className='label2-14-medium text-text-neutral-assistive ml-[0.6rem]'>
                  ({`70`}세)/{`남`}
                </span>
              </div>
              <div className='label3-12-medium text-text-neutral-secondary'>
                제 부모님처럼 모시겠습니다!
              </div>
            </div>
          </div>
          <Button variant='secondary' size='md'>
            <IcPhoneFill className='[&_path]:fill-icon-neutral-primary' />
            <span className='ml-[0.8rem]'>도우미에게 전화걸기</span>
          </Button>
          <div className='mt-[0.8rem]'>
            <StatsSummaryCard count={20} recommendRate={89} reviewCount={13} />
          </div>
        </div>

        <Tabs defaultValue='자기소개'>
          <Tabs.TabsList>
            <Tabs.TabsTrigger value='자기소개'>자기소개</Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='동행후기'>동행후기</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='자기소개'></Tabs.TabsContent>
          <Tabs.TabsContent value='동행후기'></Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button onClick={() => {}}>도우미 선택하기</Button>
      </PageLayout.Footer>
    </PageLayout>
  );
}
