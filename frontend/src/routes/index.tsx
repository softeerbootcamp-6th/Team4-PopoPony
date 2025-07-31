import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

const landingButtonData = [
  {
    title: '토닥과 함께, 투-닥터',
    description: '믿을 수 있는 병원 동행 파트너 토닥과 함께, 도우미 매칭부터 실시간 동행 확인까지 안심하고 이용해보세요.',
  },
  
];

function App() {
  return (
    <div className='h-full bg-[url("/images/landing-background.png")] bg-cover bg-center px-[2rem]'>
      <div className='flex-col-center gap-[1.6rem] pt-[4.8rem]'>
        <img src='/images/logo-text.svg' alt='logo-text' className='w-[7.2rem]' />
        <h2 className='title-20-bold text-text-neutral-secondary'>토닥과 함께, 투-닥터</h2>
      </div>

      <div className='flex-col-center mt-[4rem] gap-[1.6rem]'>
        <div className='from-neutral-5 to-neutral-10 h-[12rem] w-full rounded-[2rem] bg-gradient-to-b'></div>
        <div className='from-neutral-5 to-neutral-10 h-[12rem] w-full rounded-[2rem] bg-gradient-to-b'></div>
      </div>
    </div>
  );
}
