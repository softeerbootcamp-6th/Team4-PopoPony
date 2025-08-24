import { useNavigate } from '@tanstack/react-router';
import { PageLayout, FormLayout } from '@shared/ui/layout';
import { Button } from '@shared/ui';

const RecruitRegisterCompletePage = () => {
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
              <FormLayout.TitleWrapper>
                <FormLayout.Title>동행 신청이 완료되었어요!</FormLayout.Title>
                <FormLayout.SubTitle className='text-center'>
                  도우미가 지원하면 <br />
                  선택하실 수 있도록 알려드려요!
                </FormLayout.SubTitle>
              </FormLayout.TitleWrapper>
            </div>
          </FormLayout.Content>
        </FormLayout>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button variant='primary' className='w-full' onClick={() => navigate({ to: '/customer' })}>
          신청 내역 보기
        </Button>
      </PageLayout.Footer>
    </>
  );
};

export default RecruitRegisterCompletePage;
