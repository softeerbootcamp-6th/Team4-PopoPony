import { Button } from '@components';
import { PageLayout } from '@layouts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/escort/$escortId/report/completed')({
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
        onClose={() => navigate({ to: '/helper' })}
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
                <source src='/video/escort_completed.webm' type='video/webm' />
              </video>
            </div>
            <h2 className='headline-24-bold text-text-neutral-primary'>
              동행을 성공적으로 마무리했어요
            </h2>
            <p className='body1-16-medium text-text-neutral-secondary'>
              수익금은 업무일 기준 3일 내로 입금돼요.{' '}
            </p>
          </div>
        </div>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button onClick={() => navigate({ to: '/helper' })}>홈으로 가기</Button>
      </PageLayout.Footer>
    </PageLayout>
  );
}
