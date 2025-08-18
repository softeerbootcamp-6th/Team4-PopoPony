import { IcAlertCircle } from '@icons';

const WritingReport = () => {
  return (
    <>
      <h4 className='headline-24-bold text-text-neutral-primary'>무사히 복귀를 완료했어요!</h4>
      <h5 className='body1-16-medium text-text-neutral-secondary'>
        {`도우미가 리포트 작성중이예요.\n최대 3시간까지 소요될 수 있어요.`}
      </h5>
      <div className='aspect-square w-full max-w-[30rem]'>
        <video
          className='h-full w-full rounded-[1.2rem] object-contain'
          autoPlay
          muted
          loop
          playsInline>
          <source src='/video/pending_report.webm' type='video/webm' />
        </video>
      </div>
      <div className='flex-start bg-background-light-red gap-[0.8rem] rounded-[0.6rem] px-[1.2rem] py-[1rem]'>
        <div className='flex-start gap-[0.4rem]'>
          <IcAlertCircle className='[&_path]:fill-icon-red-primary' width={16} height={16} />
          <span className='body1-16-bold text-text-red-primary'>꼭 확인해주세요!</span>
        </div>
        <p className='body2-14-medium text-text-red-primary'>
          택시 이용금액 및 추가 발생 금액은 이전에 결제한 수단으로 자동 결제돼요.
        </p>
      </div>
    </>
  );
};

export default WritingReport;
