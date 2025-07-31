import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@layouts';
export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <PageLayout>
      <PageLayout.Header title='토닥' showBack={true} showClose={false} background={true} />
      <PageLayout.Content>
        <div className='h-full text-center'>
          <header className='body1-16-medium bg-neutral-0 flex h-full flex-col items-center justify-center text-neutral-100'>
            <p>토닥 서비스 준비중입니다.</p>
            <a
              className='text-[#61dafb] hover:underline'
              href='https://github.com/softeerbootcamp-6th/Team4-PopoPony'
              target='_blank'
              rel='noopener noreferrer'>
              팀 레포지토리 바로가기
            </a>
          </header>
        </div>
        <div className='h-[100dvh]'></div>
      </PageLayout.Content>
      <PageLayout.Footer variant='single' text='확인' onClick={() => alert('Single 버튼 클릭됨')} />
    </PageLayout>
  );
}
