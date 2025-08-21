const Landing = () => {
  return (
    <div className='fixed left-1/2 mt-[10dvh] flex w-[57rem] -translate-x-full flex-col gap-[4rem] max-[1200px]:hidden'>
      <img src='/images/logo-text.svg' alt='logo-text' className='ml-[6.6rem] w-[11rem]' />
      <img
        src='/images/landing-bg.png'
        alt='landing-background'
        className='absolute top-[14rem] h-[46rem]'
      />
      <img src='/images/landing.svg' alt='landing' className='w-[41rem]' />
      <div className='ml-[6.6rem]'>
        <h2 className='display-32-bold text-neutral-100'>토닥과 함께, 투-닥터</h2>
        <p className='body1-18-medium-pc text-text-neutral-secondary mt-[1.6rem]'>
          {`믿을 수 있는 병원 동행 파트너 토닥과 함께,\n도우미 매칭부터 실시간 동행 확인까지 안심하고 이용해보세요.`}
        </p>
        <img src='/images/qrcode.webp' alt='website-qrcode' className='mt-[2rem] w-[10rem]' />
      </div>
    </div>
  );
};

export default Landing;
