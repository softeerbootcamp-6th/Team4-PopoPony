import { Button } from '@components';
import { PageLayout } from '@layouts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { getRecruitsByRecruitId } from '@helper/apis';
import { dateFormat, timeFormatWithOptionalMinutes, timeDuration } from '@utils';
import { IcArrowRight } from '@icons';

export const Route = createFileRoute('/helper/application/$escortId/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { escortId } = Route.useParams();
  const { data } = getRecruitsByRecruitId(Number(escortId));
  const { escortDate, estimatedMeetingTime, estimatedReturnTime, route } = data?.data || {};
  const { hospitalLocationInfo, meetingLocationInfo } = route || {};
  const { placeName: hospitalName } = hospitalLocationInfo || {};
  const { placeName: meetingName } = meetingLocationInfo || {};
  return (
    <PageLayout background='bg-neutral-2'>
      <PageLayout.Header
        background={false}
        showBack={false}
        showClose={true}
        onClose={() => navigate({ to: '/customer' })}
      />
      <PageLayout.Content>
        <div className='flex h-full flex-col'>
          <div className='flex-col-center gap-[1.2rem]'>
            <div className='aspect-square w-full max-w-[30rem]'>
              <video
                className='h-full w-full rounded-[1.2rem] object-contain'
                autoPlay
                muted
                loop
                playsInline>
                <source src='/video/process_completed.webm' type='video/webm' />
              </video>
            </div>
            <h2 className='headline-24-bold text-text-neutral-primary'>지원이 완료되었어요!</h2>
            <p className='body1-16-medium text-text-neutral-secondary'>
              예약이 확정되면 문자로 알려드려요.
            </p>
          </div>
          <div className='body2-14-medium mt-auto flex w-full flex-col gap-[0.8rem] px-[2.8rem] py-[2rem]'>
            <div className='flex-start gap-[2rem]'>
              <span className='text-text-neutral-primary'>날짜</span>
              <span className='text-text-neutral-secondary'>
                {escortDate && dateFormat(escortDate, 'yyyy년 MM월 dd일 (eee)')}
              </span>
            </div>
            <div className='flex-start gap-[2rem]'>
              <span className='text-text-neutral-primary'>시간</span>
              <span className='text-text-neutral-secondary'>
                {estimatedMeetingTime && timeFormatWithOptionalMinutes(estimatedMeetingTime)} ~{' '}
                {estimatedReturnTime && timeFormatWithOptionalMinutes(estimatedReturnTime)} (
                {estimatedMeetingTime &&
                  estimatedReturnTime &&
                  timeDuration(estimatedMeetingTime, estimatedReturnTime)}
                )
              </span>
            </div>
            <div className='flex-start gap-[2rem]'>
              <span className='text-text-neutral-primary'>병원</span>
              <div className='flex-start text-text-neutral-secondary gap-[0.4rem]'>
                {meetingName} <IcArrowRight className='h-[1.6rem] w-[1.6rem]' /> {hospitalName}
              </div>
            </div>
          </div>
          <div className='w-full px-[2rem] pb-[2rem]'>
            <Button variant='secondary' onClick={() => navigate({ to: '/helper/application' })}>
              다른 일감 지원하기
            </Button>
          </div>
        </div>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button onClick={() => navigate({ to: '/customer' })}>홈으로 가기</Button>
      </PageLayout.Footer>
    </PageLayout>
  );
}
