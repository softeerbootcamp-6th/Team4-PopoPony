import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { PageLayout } from '@shared/ui/layout';
import { Button, Logo, Tabs } from '@shared/ui';
import { RecruitCard } from '@widgets/ui';
import type { RecruitStatus } from '@shared/types';
import { dateFormat, timeFormat } from '@shared/lib';
import { getRecruitList, getProfileExistance } from '@helper/apis';
import type { RecruitSimpleResponse, EscortStatus } from '@helper/types';
// import { toast } from 'sonner';

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
  동행완료: '동행번호 NO.',
};
const escortStatusMessageMap: Record<NonNullable<EscortStatus>, string> = {
  //동행준비, 리포트 작성중, 동행완료는 차피 쓰이지 않음. 타입 에러 해결 위해 넣음.
  동행준비: '동행 준비 중입니다.',
  만남중: '동행자에게 이동해주세요.',
  병원행: '병원으로 이동해주세요.',
  진료중: '병원에서 진료 중입니다.',
  복귀중: '안전하게 복귀해주세요.',
  리포트작성중: '리포트를 작성 중입니다.',
  동행완료: '동행이 완료되었습니다.',
};

const refineEscortData = (escortData: RecruitSimpleResponse): RefinedEscortData => {
  let statusText = '';
  if (escortData.recruitStatus === '동행중' && escortData.escortStatus) {
    statusText = escortStatusMessageMap[escortData.escortStatus as NonNullable<EscortStatus>] ?? '';
  } else {
    if (escortData.recruitStatus === '동행완료') {
      statusText = statusMessageMap[escortData.recruitStatus] + (escortData.recruitId || '');
    } else {
      statusText = statusMessageMap[escortData.recruitStatus];
    }
  }
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
  const { data: hasProfileData } = getProfileExistance();
  const { hasProfile, helperProfileId } = hasProfileData?.data ?? {
    hasProfile: false,
    helperProfileId: undefined,
  };
  const { data: recruitListData } = getRecruitList();
  const { inProgressList: inProgressListData, completedList: completedListData } =
    recruitListData?.data ?? {};
  const navigate = useNavigate();
  const handleClickApplication = () => {
    if (hasProfile && helperProfileId) {
      navigate({
        to: '/helper/application',
        params: { helperId: helperProfileId.toString() },
      });
    } else {
      alert('프로필을 작성해주세요.');
      // toast.error('프로필을 작성해주세요.');
    }
  };
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
    <>
      <PageLayout.Content>
        <div className='bg-neutral-10 relative h-full max-h-[22rem] p-[2rem]'>
          <div className='absolute z-10 w-[calc(100%-4rem)]'>
            <Link to='/'>
              <Logo className='text-[2rem]' />
            </Link>
            <h2 className='headline-24-bold text-text-neutral-primary mt-[2.4rem] mb-[3rem]'>
              토닥과 함께 <br />
              안전하게 동행하세요!
            </h2>
            <div className='flex-between flex w-full gap-[1.2rem]'>
              <div className='flex-1'>
                {hasProfile && helperProfileId ? (
                  <Link
                    to={`/helper/profile/$helperId`}
                    params={{ helperId: helperProfileId.toString() }}>
                    <Button variant='assistive' size='md'>
                      <span className='text-text-neutral-primary'>프로필 바로가기</span>
                    </Button>
                  </Link>
                ) : (
                  <Link
                    to='/helper/profile/new/$step'
                    params={{ step: 'region' }}
                    search={{ mode: 'new' }}>
                    <Button variant='assistive' size='md'>
                      <span className='text-text-neutral-primary'>프로필 작성하기</span>
                    </Button>
                  </Link>
                )}
              </div>
              <div className='flex-1'>
                <Button size='md' onClick={handleClickApplication}>
                  <span className='text-text-neutral-0'>일감찾기</span>
                </Button>
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
                  <RecruitCard
                    key={escort.recruitId}
                    onClick={() => handleEscortCardClick(escort.recruitId, false)}>
                    <RecruitCard.StatusHeader
                      status={refinedData.status}
                      text={refinedData.statusText}
                      title={refinedData.title}
                    />
                    <RecruitCard.Divider />
                    <RecruitCard.InfoSection>
                      <RecruitCard.Info type='time' text={refinedData.timeText} />
                      <RecruitCard.Info type='location' text={refinedData.locationText} />
                    </RecruitCard.InfoSection>
                    {refinedData.status === '동행중' && (
                      <RecruitCard.DashboardButton
                        onClick={() => {
                          navigate({
                            to: '/dashboard/$escortId/helper',
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
            </div>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='완료'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              {completedListData?.map((escort) => {
                const refinedData = refineEscortData(escort);
                return (
                  <RecruitCard
                    key={escort.recruitId}
                    onClick={() => handleEscortCardClick(escort.recruitId, true)}>
                    <RecruitCard.StatusHeader
                      status={refinedData.status}
                      text={refinedData.statusText}
                      title={refinedData.title}
                    />
                    <RecruitCard.Divider />
                    <RecruitCard.InfoSection>
                      <RecruitCard.Info type='time' text={refinedData.timeText} />
                      <RecruitCard.Info type='location' text={refinedData.locationText} />
                    </RecruitCard.InfoSection>
                  </RecruitCard>
                );
              })}
            </div>
          </Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
    </>
  );
}
