import { createFileRoute, Link } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Button, EscortCard, Tabs } from '@components';
import { IcPlusSideLeft } from '@icons';
import type { RecruitSimpleResponse } from '@customer/types';
import { getRecruitsCustomer } from '@customer/apis';
import { dateFormat, timeFormat } from '@utils';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
});

const refineRecruitData = (recruitData: RecruitSimpleResponse) => {
  let statusText = '';
  if (recruitData.status === '매칭중') {
    statusText = `${recruitData.numberOfApplication}명이 현재 지원중이예요!`;
  } else if (recruitData.status === '매칭완료') {
    statusText = '매칭이 확정되었어요!';
  } else if (recruitData.status === '동행중') {
    statusText = '동행이 진행중입니다!';
  } else if (recruitData.status === '동행완료') {
    statusText = '동행번호 NO.' + recruitData.recruitId;
  }
  const title =
    dateFormat(recruitData.escortDate, 'M월 d일 (eee)') + ', ' + recruitData.destination;
  const startTime = timeFormat(recruitData.estimatedMeetingTime);
  const endTime = timeFormat(recruitData.estimatedReturnTime);
  const dateText = dateFormat(recruitData.escortDate, 'M월 d일(eee)');
  const timeText = `${dateText} ${startTime} ~ ${endTime}`;
  const locationText = `${recruitData.departureLocation} → ${recruitData.destination}`;
  return { statusText, title, timeText, locationText };
};

function RouteComponent() {
  const { data: escortData } = getRecruitsCustomer();
  const { inProgressList, completedList } = escortData?.data ?? {};
  const navigate = useNavigate();
  const handleEscortCardClick = (recruitId: number) => {
    navigate({
      to: '/customer/escort/$escortId',
      params: {
        escortId: recruitId.toString(),
      },
    });
  };

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
              <span className='group-data-[state=active]:text-text-mint-primary'>
                {inProgressList?.length || 0}
              </span>
            </Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='완료'>
              완료
              <span className='group-data-[state=active]:text-text-mint-primary'>
                {completedList?.length || 0}
              </span>
            </Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='신청'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              {inProgressList?.map((escort) => {
                const { statusText, title, timeText, locationText } = refineRecruitData(escort);
                return (
                  <EscortCard
                    key={escort.recruitId}
                    onClick={() => handleEscortCardClick(escort.recruitId)}>
                    <EscortCard.StatusHeader
                      status={escort.status}
                      text={statusText}
                      title={title}
                    />
                    <EscortCard.Divider />
                    <EscortCard.InfoSection>
                      <EscortCard.Info type='time' text={timeText} />
                      <EscortCard.Info type='location' text={locationText} />
                    </EscortCard.InfoSection>
                  </EscortCard>
                );
              })}
            </div>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='완료'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              {completedList?.map((escort) => {
                const { statusText, title, timeText, locationText } = refineRecruitData(escort);
                return (
                  <EscortCard
                    key={escort.recruitId}
                    onClick={() => handleEscortCardClick(escort.recruitId)}>
                    <EscortCard.StatusHeader
                      status={escort.status}
                      text={statusText}
                      title={title}
                    />
                    <EscortCard.Divider />
                    <EscortCard.InfoSection>
                      <EscortCard.Info type='time' text={timeText} />
                      <EscortCard.Info type='location' text={locationText} />
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
