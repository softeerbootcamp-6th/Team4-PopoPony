import { IcPlusSideLeft } from '@icons';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';

import { RecruitCard } from '@widgets/ui';

import { $api } from '@shared/api';
import { dateFormat, timeFormat } from '@shared/lib';
import type { EscortStatus } from '@shared/types';
import { Button, EmptyCard, FallbackUI, Logo, Tabs } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';

import { getRecruitsCustomer } from '@customer/apis';
import type { RecruitSimpleResponse } from '@customer/types';

const escortStatusMessageMap: Record<NonNullable<EscortStatus>, string> = {
  //동행준비, 리포트 작성중, 동행완료는 차피 쓰이지 않음. 타입 에러 해결 위해 넣음.
  동행준비: '동행 준비 중입니다.',
  만남중: '도우미와 곧 만나요!',
  병원행: '병원으로 이동하고 있어요!',
  진료중: '병원에서 안전하게 진료중이에요!',
  복귀중: '도우미와 안전하게 복귀하고 있어요!',
  리포트작성중: '리포트를 작성 중입니다.',
  동행완료: '동행이 완료되었습니다.',
};

const refineRecruitData = (recruitData: RecruitSimpleResponse) => {
  let statusText = '';
  if (recruitData.recruitStatus === '매칭중') {
    statusText = `${recruitData.numberOfApplication}명이 현재 지원중이예요!`;
  } else if (recruitData.recruitStatus === '매칭완료') {
    statusText = '매칭이 확정되었어요!';
  } else if (recruitData.recruitStatus === '동행중') {
    if (recruitData.escortStatus) {
      statusText = escortStatusMessageMap[recruitData.escortStatus] ?? '';
    } else {
      statusText = '도우미와 곧 만나요!';
    }
  } else if (recruitData.recruitStatus === '동행완료') {
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

const CustomerHomePage = () => {
  const { data: escortData, error } = getRecruitsCustomer();
  const qc = useQueryClient();
  const helperListOpts = $api.queryOptions('get', '/api/recruits/helper');

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
    <PageLayout.Content>
      <div className='bg-neutral-10 relative h-full max-h-[22rem] p-[2rem]'>
        <div className='absolute z-10 flex h-[18rem] w-[calc(100%-4rem)] flex-col justify-between'>
          <Link to='/'>
            <Logo className='text-[2rem]' />
          </Link>
          <h2 className='headline-24-bold text-text-neutral-primary'>
            토닥과 함께 <br />
            안전하게 동행하세요!
          </h2>
          <div className='w-[20rem]'>
            <Button
              variant='assistive'
              size='md'
              onClick={() =>
                navigate({ to: '/customer/recruit/$step', params: { step: 'profile' } })
              }>
              <IcPlusSideLeft />
              <span className='text-text-neutral-primary'>새로운 동행 신청하기</span>
            </Button>
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
            {error && (
              <FallbackUI
                error={error}
                onReset={() => {
                  qc.invalidateQueries(helperListOpts);
                }}
              />
            )}
            {inProgressList &&
              inProgressList.length > 0 &&
              !error &&
              inProgressList.map((escort) => {
                const { statusText, title, timeText, locationText } = refineRecruitData(escort);
                return (
                  <RecruitCard
                    key={escort.recruitId}
                    onClick={() => handleEscortCardClick(escort.recruitId)}>
                    <RecruitCard.StatusHeader
                      status={escort.recruitStatus}
                      text={statusText}
                      title={title}
                    />
                    <RecruitCard.Divider />
                    <RecruitCard.InfoSection>
                      <RecruitCard.Info type='time' text={timeText} />
                      <RecruitCard.Info type='location' text={locationText} />
                    </RecruitCard.InfoSection>
                    {escort.recruitStatus === '동행중' && (
                      <RecruitCard.DashboardButton
                        onClick={() => {
                          navigate({
                            to: '/dashboard/$escortId/customer',
                            params: {
                              escortId: escort.recruitId.toString(),
                            },
                          });
                        }}
                      />
                    )}
                  </RecruitCard>
                );
              })}
            {inProgressList && inProgressList.length === 0 && (
              <EmptyCard text='현재 신청중인 동행 내역이 없어요' />
            )}
          </div>
        </Tabs.TabsContent>
        <Tabs.TabsContent value='완료'>
          <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
            {error && (
              <FallbackUI
                error={error}
                onReset={() => {
                  qc.invalidateQueries(helperListOpts);
                }}
              />
            )}
            {completedList &&
              completedList.length > 0 &&
              !error &&
              completedList.map((escort) => {
                const { statusText, title, timeText, locationText } = refineRecruitData(escort);
                return (
                  <RecruitCard
                    key={escort.recruitId}
                    onClick={() => handleEscortCardClick(escort.recruitId)}>
                    <RecruitCard.StatusHeader
                      status={escort.recruitStatus}
                      text={statusText}
                      title={title}
                    />
                    <RecruitCard.Divider />
                    <RecruitCard.InfoSection>
                      <RecruitCard.Info type='time' text={timeText} />
                      <RecruitCard.Info type='location' text={locationText} />
                    </RecruitCard.InfoSection>
                  </RecruitCard>
                );
              })}
            {completedList && completedList.length === 0 && !error && (
              <EmptyCard text='완료된 동행 내역이 없어요' />
            )}
          </div>
        </Tabs.TabsContent>
      </Tabs>
    </PageLayout.Content>
  );
};

export default CustomerHomePage;
