import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PageLayout, FormLayout } from '@layouts';
import { Button } from '@components';

export const Route = createFileRoute('/helper/profile/new/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <>
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
              <div className='text-center'>
                <FormLayout.TitleWrapper>
                  <FormLayout.Title>프로필 작성이 완료되었어요!</FormLayout.Title>
                  <FormLayout.SubTitle className='text-center'>
                    프로필은 일감찾기 메인 화면의 <br />
                    우측 상단에서 언제든지 수정가능합니다.
                  </FormLayout.SubTitle>
                </FormLayout.TitleWrapper>
              </div>
            </div>
          </FormLayout.Content>
        </FormLayout>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button variant='primary' onClick={() => navigate({ to: '/helper' })}>
          일감찾기 홈으로 가기
        </Button>
      </PageLayout.Footer>
    </>
  );
}
