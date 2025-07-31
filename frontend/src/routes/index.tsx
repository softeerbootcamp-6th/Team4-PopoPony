import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
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
  );
}
