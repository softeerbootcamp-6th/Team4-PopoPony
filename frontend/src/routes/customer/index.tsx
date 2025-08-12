import { createFileRoute, Link } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Button, EscortCard, Tabs } from '@components';
import { IcPlusSideLeft } from '@icons';
import { getRecruitsCustomer } from '@customer/apis';
import { dateFormat, timeFormat } from '@utils';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: escortData } = getRecruitsCustomer();
  const { inProgressList, completedList } = escortData?.data ?? {};

  return (
    <PageLayout>
      <PageLayout.Content>
        <div className='bg-neutral-10 relative h-full max-h-[22rem] p-[2rem]'>
          <div className='absolute z-10'>
            <Link to='/'>
              <img src='/images/logo-text.svg' alt='logo-text' className='w-[4rem]' />
            </Link>
            <h2 className='headline-24-bold text-text-neutral-primary mt-[2.4rem] mb-[3rem]'>
              토닥과 함께 <br />
              안전하게 동행하세요!
            </h2>
            <Link to='/customer/recruit/$step' params={{ step: 'profile' }}>
              <Button variant='assistive' size='md'>
                <IcPlusSideLeft />
                <span className='text-text-neutral-primary'>새로운 동행 신청하기</span>
              </Button>
            </Link>
          </div>
          <img
            src='/images/home-graphic.svg'
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
          <Tabs.TabsContent value='신청'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              {inProgressList?.map((escort) => {
                const escortDate = dateFormat(escort.escortDate, 'MM월 dd일(eee)');
                return (
                  <EscortCard key={escort.escortId}>
                    <EscortCard.StatusHeader
                      status={escort.status}
                      text={`${escort.numberOfApplication}명이 현재 지원 중이에요!`}
                      title={`${escortDate} ${escort.destination}`}
                    />
                    <EscortCard.Divider />
                    <EscortCard.InfoSection>
                      <EscortCard.Info
                        type='time'
                        text={`${escortDate} ${timeFormat(escort.estimatedMeetingTime)} ~ ${timeFormat(escort.estimatedReturnTime)}`}
                      />
                      <EscortCard.Info
                        type='location'
                        text={`${escort.departureLocation} → ${escort.destination}`}
                      />
                    </EscortCard.InfoSection>
                  </EscortCard>
                );
              })}
            </div>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='완료'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              {completedList?.map((escort) => {
                const escortDate = dateFormat(escort.escortDate, 'MM월 dd일(eee)');
                return (
                  <EscortCard key={escort.escortId}>
                    <EscortCard.StatusHeader
                      status={escort.status}
                      text={`${escort.numberOfApplication}명이 현재 지원 중이에요!`}
                      title={`${escortDate} ${escort.destination}`}
                    />
                    <EscortCard.Divider />
                    <EscortCard.InfoSection>
                      <EscortCard.Info
                        type='time'
                        text={`${escortDate} ${timeFormat(escort.estimatedMeetingTime)} ~ ${timeFormat(escort.estimatedReturnTime)}`}
                      />
                      <EscortCard.Info
                        type='location'
                        text={`${escort.departureLocation} → ${escort.destination}`}
                      />
                    </EscortCard.InfoSection>
                  </EscortCard>
                );
              })}
            </div>
          </Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
    </PageLayout>
  );
}
