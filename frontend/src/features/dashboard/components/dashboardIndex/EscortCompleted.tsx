type Props = Record<string, never>;

const EscortCompleted = (_props: Props) => {
  return (
    <>
      <div className='aspect-square w-full max-w-[30rem]'>
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
        <h5 className='body1-16-medium text-text-neutral-secondary'>
          {`도우미가 남긴 상세한 리포트를\n확인해보세요.`}
        </h5>
      </div>
    </>
  );
};

export default EscortCompleted;
