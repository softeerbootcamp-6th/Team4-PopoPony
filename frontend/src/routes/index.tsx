import { Logo } from '@components';
import { PageLayout } from '@layouts';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

const landingButtonData = [
  {
    subtitle: '보호자 서비스',
    title: '병원 동행 신청하기',
    image: '/images/hospital.svg',
    link: '/customer',
  },
  {
    subtitle: '도우미 서비스',
    title: '일감 찾기',
    image: '/images/work.svg',
    link: '/helper',
  },
];

function App() {
  return (
    <div className='flex-1'>
      <div className='h-full bg-[url("/images/landing-background.png")] bg-cover bg-center px-[2rem]'>
        <div className='flex-col-center gap-[1.6rem] pt-[9.6rem]'>
          <Logo className='text-[3.6rem]' />
          <h2 className='title-20-bold text-text-neutral-secondary'>토닥과 함께, 투-닥터!</h2>
        </div>

        <div className='flex-col-center mt-[4rem] cursor-pointer gap-[0.8rem]'>
          {landingButtonData.map((data) => (
            <Link
              key={data.title}
              to={data.link}
              className='from-neutral-5 to-neutral-10 relative flex h-[12rem] w-full justify-between rounded-[2rem] bg-gradient-to-b p-[1.6rem]'>
              <div className='z-10'>
                <h3 className='body2-14-bold text-text-mint-primary'>{data.subtitle}</h3>
                <h2 className='headline-24-bold text-text-neutral-primary mt-[0.4rem]'>
                  {data.title}
                </h2>
              </div>
              <img
                src={data.image}
                alt={data.title}
                className='absolute right-[1.6rem] max-h-[8.8rem]'
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
