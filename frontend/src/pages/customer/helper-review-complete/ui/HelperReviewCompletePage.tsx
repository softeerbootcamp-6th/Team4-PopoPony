import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { Button } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';

const HelperReviewCompletePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  queryClient.removeQueries({ queryKey: ['reviewFormStarted'] });
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
              도우미 후기를 남겼어요!
            </h2>
            <p className='body1-16-medium text-text-neutral-secondary text-center'>
              남겨주신 후기는 다른 동행 고객 분들께<br /> 큰 도움이 될 거예요.
            </p>
          </div>
        </div>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button onClick={() => navigate({ to: '/customer' })}>홈으로 가기</Button>
      </PageLayout.Footer>
    </>
  );
};

export default HelperReviewCompletePage;
