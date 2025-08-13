import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageLayout, FormLayout } from '@layouts';
import { Button } from '@components';

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
        <FormLayout>
          <FormLayout.Content>
            <div className='flex h-full flex-col items-center justify-center gap-[1.2rem]'>
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
              <FormLayout.TitleWrapper>
                <FormLayout.Title>도우미 후기를 남겼어요!</FormLayout.Title>
                <FormLayout.SubTitle className='text-center'>
                  {`남겨주신 후기는 다른 동행 고객 분들께\n큰 도움이 될 거예요.`}
                </FormLayout.SubTitle>
              </FormLayout.TitleWrapper>
            </div>
          </FormLayout.Content>
        </FormLayout>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button variant='primary' className='w-full' onClick={() => navigate({ to: '/customer' })}>
          홈으로 가기
        </Button>
      </PageLayout.Footer>
    </PageLayout>
  );
}
