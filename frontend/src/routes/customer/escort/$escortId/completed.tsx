import { Button, ShowMapButton } from '@components';
import { FormLayout, PageLayout } from '@layouts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
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
              <span className='text-text-neutral-secondary'>2025년 7월 22일 (토)</span>
            </div>
            <div className='flex-start gap-[2rem]'>
              <span className='text-text-neutral-primary'>동행 시간</span>
              <span className='text-text-neutral-secondary'>오후 12시 ~ 3시 (3시간)</span>
            </div>
            <div className='flex-start gap-[2rem]'>
              <span className='text-text-neutral-primary'>방문 병원</span>
              <div>
                <ShowMapButton businessAddress='서울아산병원' />
              </div>
            </div>
          </div>
        </div>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button onClick={() => navigate({ to: '/customer' })}>홈으로 가기</Button>
      </PageLayout.Footer>
    </PageLayout>
  );
}
