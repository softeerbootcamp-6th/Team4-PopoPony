import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, getRouteApi, useNavigate } from '@tanstack/react-router';

import { dateFormat, timeDuration, timeFormatWithOptionalMinutes } from '@shared/lib';
import { Button, ShowMapButton } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';

import { getRecruitById } from '@customer/apis';

const routeApi = getRouteApi('/customer/escort/$escortId/completed');

export const Route = createFileRoute('/customer/escort/$escortId/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { escortId } = routeApi.useParams();
  const queryClient = useQueryClient();
  const { data } = getRecruitById(Number(escortId));
  const { escortDate, estimatedMeetingTime, estimatedReturnTime, route } = data?.data || {};
  return (
    <>
      <PageLayout.Header
        background={false}
        showBack={false}
        showClose={true}
        onClose={() => {
          queryClient.removeQueries({ queryKey: ['escortFormStarted'] });
          navigate({ to: '/customer' });
        }}
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
            <h2 className='headline-24-bold text-text-neutral-primary'>
              동행 신청이 완료되었어요!
            </h2>
            <p className='body1-16-medium text-text-neutral-secondary'>
              동행 시작 3시간 전 도우미의 위치를 알려드려요.
            </p>
          </div>
          <div className='body2-14-medium mt-auto flex w-full flex-col gap-[0.8rem] px-[2.8rem] py-[2rem]'>
            <div className='flex-start gap-[2rem]'>
              <span className='text-text-neutral-primary'>동행 날짜</span>
              <span className='text-text-neutral-secondary'>
                {escortDate && dateFormat(escortDate, 'yyyy년 MM월 dd일 (eee)')}
              </span>
            </div>
            <div className='flex-start gap-[2rem]'>
              <span className='text-text-neutral-primary'>동행 시간</span>
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
              <span className='text-text-neutral-primary'>방문 병원</span>
              <div>
                <ShowMapButton
                  businessAddress={route?.hospitalLocationInfo?.placeName || ''}
                  pos={{
                    lat: route?.hospitalLocationInfo?.lat || 0,
                    lng: route?.hospitalLocationInfo?.lon || 0,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button
          onClick={() => {
            queryClient.removeQueries({ queryKey: ['escortFormStarted'] });
            navigate({ to: '/customer' });
          }}>
          홈으로 가기
        </Button>
      </PageLayout.Footer>
    </>
  );
}
