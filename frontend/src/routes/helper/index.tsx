import { createFileRoute, Link } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
import { Button, EscortCard, Tabs } from '@components';
import type { StatusType } from '@types';
import { dateFormat, timeFormat } from '@utils';

export const Route = createFileRoute('/helper/')({
  component: RouteComponent,
});

/**
 * @description 필요한 동행 데이터 타입
 */
interface EscortData {
  id: number;
  status: StatusType;
  escortDate: string;
  estimatedMeetingTime: string;
  estimatedReturnTime: string;
  meetingPlaceName: string;
  destinationPlaceName: string;
}

/**
 * @description 동행 데이터를 추출하여 정제 후 반환
 */
interface RefinedEscortData {
  id: number;
  status: StatusType;
  statusText: string;
  title: string;
  timeText: string;
  locationText: string;
}

const inProgressList: EscortData[] = [
  {
    id: 1,
    status: 'MATCHING',
    escortDate: '2025-07-22',
    estimatedMeetingTime: '12:00:00',
    estimatedReturnTime: '15:00:00',
    meetingPlaceName: '꿈에그린아파트',
    destinationPlaceName: '서울아산병원',
  },
  {
    id: 2,
    status: 'COMPLETED',
    escortDate: '2025-07-23',
    estimatedMeetingTime: '10:30:00',
    estimatedReturnTime: '13:30:00',
    meetingPlaceName: '래미안아파트',
    destinationPlaceName: '삼성서울병원',
  },
  {
    id: 3,
    status: 'COMPLETED',
    escortDate: '2025-07-24',
    estimatedMeetingTime: '11:00:00',
    estimatedReturnTime: '14:00:00',
    meetingPlaceName: '래미안아파트',
    destinationPlaceName: '삼성서울병원',
  },
  {
    id: 4,
    status: 'MEETING',
    escortDate: '2025-07-25',
    estimatedMeetingTime: '09:00:00',
    estimatedReturnTime: '12:00:00',
    meetingPlaceName: '자이아파트',
    destinationPlaceName: '강남세브란스병원',
  },
  {
    id: 5,
    status: 'HEADING_TO_HOSPITAL',
    escortDate: '2025-07-26',
    estimatedMeetingTime: '11:00:00',
    estimatedReturnTime: '14:00:00',
    meetingPlaceName: '롯데캐슬아파트',
    destinationPlaceName: '서울대병원',
  },
  {
    id: 6,
    status: 'IN_TREATMENT',
    escortDate: '2025-07-27',
    estimatedMeetingTime: '13:30:00',
    estimatedReturnTime: '16:30:00',
    meetingPlaceName: '힐스테이트아파트',
    destinationPlaceName: '고려대안암병원',
  },
  {
    id: 7,
    status: 'RETURNING',
    escortDate: '2025-07-28',
    estimatedMeetingTime: '08:30:00',
    estimatedReturnTime: '11:30:00',
    meetingPlaceName: '푸르지오아파트',
    destinationPlaceName: '한양대병원',
  },
];

const completedList: EscortData[] = [
  {
    id: 8,
    status: 'DONE',
    escortDate: '2025-07-29',
    estimatedMeetingTime: '15:00:00',
    estimatedReturnTime: '18:00:00',
    meetingPlaceName: '아크로리버파크',
    destinationPlaceName: '성모병원',
  },
];

const statusMessageMap: Record<StatusType, string> = {
  MATCHING: '아직 매칭 확정되지 않았어요!',
  COMPLETED: '매칭이 확정되었어요!',
  IN_PROGRESS: '동행이 진행중입니다!',
  MEETING: '동행자에게 이동해주세요.',
  HEADING_TO_HOSPITAL: '병원으로 이동해주세요.',
  IN_TREATMENT: '병원에서 진료중입니다.',
  RETURNING: '안전하게 복귀해주세요.',
  DONE: '동행번호 NO.12394O4L',
};

/**
 * escortData를 받아서 필요한 데이터를 추출하여 반환 -> 나중에 API 연동 시 이 함수 삭제 혹은 이용
 * @param escortData - 각각의 동행 데이터
 * @returns 필요한 데이터를 정제한 데이터
 */
const refineEscortData = (escortData: EscortData): RefinedEscortData => {
  const statusText = statusMessageMap[escortData.status];
  const title =
    dateFormat(escortData.escortDate, 'M월 d일 (eee)') + ', ' + escortData.destinationPlaceName;
  const startTime = timeFormat(escortData.estimatedMeetingTime);
  const endTime = timeFormat(escortData.estimatedReturnTime);
  const dateText = dateFormat(escortData.escortDate, 'M월 d일(eee)');
  const timeText = `${dateText} ${startTime} ~ ${endTime}`;
  const locationText = `${escortData.meetingPlaceName} → ${escortData.destinationPlaceName}`;

  return {
    id: escortData.id,
    status: escortData.status,
    statusText,
    title,
    timeText,
    locationText,
  };
};

function RouteComponent() {
  const hasProfile = false;
  //TODO: 추후 api call로 전환
  const inProgressListData = inProgressList;
  const completedListData = completedList;

  return (
    <PageLayout>
      <PageLayout.Content>
        <div className='bg-neutral-10 relative h-full max-h-[22rem] px-[2rem] py-[1rem] pb-[2rem]'>
          <div className='absolute z-10 w-[calc(100%-4rem)]'>
            <img src='/images/logo-text.svg' alt='logo-text' className='w-[4rem]' />
            <h2 className='headline-24-bold text-text-neutral-primary mt-[2.4rem] mb-[3rem]'>
              토닥과 함께 <br />
              안전하게 동행하세요!
            </h2>
            <div className='flex-between flex w-full gap-[1.2rem]'>
              <div className='flex-1'>
                <Link
                  to={hasProfile ? '/helper/profile' : '/helper/profile/new/$step'}
                  params={{ step: 'region' }}>
                  <Button variant='assistive' size='md'>
                    <span className='text-text-neutral-primary'>
                      {hasProfile ? '프로필 바로가기' : '프로필 작성하기'}
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
                {inProgressListData.length}
              </span>
            </Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='완료'>
              완료
              <span className='group-data-[state=active]:text-text-mint-primary'>
                {completedListData.length}
              </span>
            </Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='신청'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              {inProgressListData.map((escort) => {
                const refinedData = refineEscortData(escort);
                return (
                  <EscortCard key={escort.id}>
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
                    <EscortCard.Tag tags={['support', 'wheelchair', 'care']} />
                    {(refinedData.status === 'MEETING' ||
                      refinedData.status === 'HEADING_TO_HOSPITAL' ||
                      refinedData.status === 'IN_TREATMENT' ||
                      refinedData.status === 'RETURNING') && (
                      <EscortCard.Button onClick={() => {}} />
                    )}
                  </EscortCard>
                );
              })}
            </div>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='완료'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'>
              {completedListData.map((escort) => {
                const refinedData = refineEscortData(escort);
                return (
                  <EscortCard key={escort.id}>
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
                    <EscortCard.Tag tags={['support', 'wheelchair', 'care']} />
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
