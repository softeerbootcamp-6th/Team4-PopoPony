import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Button, EscortCard, Tabs } from '@components';
import type { RecruitStatus } from '@types';
import { dateFormat, timeFormat } from '@utils';
import { getRecruitList, getHasProfile } from '@helper/apis';
import type { RecruitSimpleResponse } from '@helper/types';

export const Route = createFileRoute('/helper/')({
  component: RouteComponent,
});
interface RefinedEscortData {
  id: number;
  status: RecruitStatus;
  statusText: string;
  title: string;
  timeText: string;
  locationText: string;
}

const statusMessageMap: Record<RecruitStatus, string> = {
  매칭중: '아직 매칭 확정되지 않았어요!',
  매칭완료: '매칭이 확정되었어요!',
  동행중: '동행이 진행중입니다!',
  동행완료: '동행번호 NO.12394O4L',
};

const refineEscortData = (escortData: RecruitSimpleResponse): RefinedEscortData => {
  const statusText = statusMessageMap[escortData.recruitStatus];
  const title = dateFormat(escortData.escortDate, 'M월 d일 (eee)') + ', ' + escortData.destination;
  const startTime = timeFormat(escortData.estimatedMeetingTime);
  const endTime = timeFormat(escortData.estimatedReturnTime);
  const dateText = dateFormat(escortData.escortDate, 'M월 d일(eee)');
  const timeText = `${dateText} ${startTime} ~ ${endTime}`;
  const locationText = `${escortData.departureLocation} → ${escortData.destination}`;

  return {
    id: escortData.recruitId,
    status: escortData.recruitStatus,
    statusText,
    title,
    timeText,
    locationText,
  };
};

function RouteComponent() {
  const { data: hasProfileData } = getHasProfile();
  const { data: recruitListData } = getRecruitList();
  const { inProgressList: inProgressListData, completedList: completedListData } =
    recruitListData?.data ?? {};
  const navigate = useNavigate();
  const handleEscortCardClick = (recruitId: number, isCompleted: boolean) => {
    if (isCompleted) {
      navigate({
        to: '/helper/escort/$escortId',
        params: {
          escortId: recruitId.toString(),
        },
      });
    } else {
      navigate({
        to: '/helper/application/$escortId',
        params: {
          escortId: recruitId.toString(),
        },
      });
    }
  };

  return (
    <PageLayout>
      <PageLayout.Content>
        <div className='bg-neutral-10 relative h-full max-h-[22rem] p-[2rem]'>
          <div className='absolute z-10 w-[calc(100%-4rem)]'>
            <Link to='/'>
              <img src='/images/logo-text.svg' alt='logo-text' className='w-[4rem]' />
            </Link>
            <h2 className='headline-24-bold text-text-neutral-primary mt-[2.4rem] mb-[3rem]'>
              토닥과 함께 <br />
              안전하게 동행하세요!
            </h2>
            <div className='flex-between flex w-full gap-[1.2rem]'>
              <div className='flex-1'>
                <Link
                  to={
                    hasProfileData?.hasProfile
                      ? `/helper/profile/$helperId`
                      : '/helper/profile/new/$step'
                  }
                  params={{ step: 'region', helperId: hasProfileData?.helperId.toString() }}>
                  <Button variant='assistive' size='md'>
                    <span className='text-text-neutral-primary'>
                      {hasProfileData?.hasProfile ? '프로필 바로가기' : '프로필 작성하기'}
                    </span>
                  </Button>
                </Link>
              </div>
              <div className='flex-1'>
                {/* TODO: 추후 동행 상세 페이지 연동 시 수정 */}
                <Link to='/helper/escort/$escortId' params={{ escortId: '1' }}>
                  <Button size='md'>
                    <span className='text-text-neutral-0'>일감찾기</span>
                  </Button>
                </Link>
              </div>
            </div>
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
                {inProgressListData?.length || 0}
              </span>
            </Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='완료'>
              완료
              <span className='group-data-[state=active]:text-text-mint-primary'>
                {completedListData?.length || 0}
              </span>
            </Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='신청'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              {inProgressListData?.map((escort) => {
                const refinedData = refineEscortData(escort);
                return (
                  <EscortCard
                    key={escort.recruitId}
                    onClick={() => handleEscortCardClick(escort.recruitId, false)}>
                    <EscortCard.StatusHeader
                      status={refinedData.status}
                      text={refinedData.statusText}
                      title={refinedData.title}
                    />
                    <EscortCard.Divider />
                    <EscortCard.InfoSection>
                      <EscortCard.Info type='time' text={refinedData.timeText} />
                      <EscortCard.Info type='location' text={refinedData.locationText} />
                    </EscortCard.InfoSection>
                    {refinedData.status === '동행중' && <EscortCard.Button onClick={() => {}} />}
                  </EscortCard>
                );
              })}
            </div>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='완료'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              {completedListData?.map((escort) => {
                const refinedData = refineEscortData(escort);
                return (
                  <EscortCard
                    key={escort.recruitId}
                    onClick={() => handleEscortCardClick(escort.recruitId, true)}>
                    <EscortCard.StatusHeader
                      status={refinedData.status}
                      text={refinedData.statusText}
                      title={refinedData.title}
                    />
                    <EscortCard.Divider />
                    <EscortCard.InfoSection>
                      <EscortCard.Info type='time' text={refinedData.timeText} />
                      <EscortCard.Info type='location' text={refinedData.locationText} />
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
