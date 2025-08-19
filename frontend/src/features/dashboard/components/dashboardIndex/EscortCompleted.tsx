const EscortCompleted = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center p-[2rem]'>
      <div className='aspect-square w-full'>
        <video
          className='h-full w-full rounded-[1.2rem] object-contain'
          autoPlay
          muted
          loop
          playsInline>
          <source src='/video/escort_completed.webm' type='video/webm' />
        </video>
      </div>
      <div className='text-center'>
        <h4 className='headline-24-bold text-text-neutral-primary'>동행이 성공적으로 끝났어요!</h4>
        <p className='body1-16-medium text-text-neutral-secondary mt-[1.6rem]'>
          {`도우미가 남긴 상세한 리포트를\n확인해보세요.`}
        </p>
      </div>
    </div>
  );
};

export default EscortCompleted;
