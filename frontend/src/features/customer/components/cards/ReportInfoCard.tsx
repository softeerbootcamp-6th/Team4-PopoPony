const ReportInfoCard = () => {
  return (
    <div className='flex-between border-stroke-neutral-dark bg-background-light-neutral h-[12rem] rounded-[0.8rem] border p-[2rem]'>
      <div>
        <h6 className='body1-16-bold text-text-neutral-secondary'>리포트 기다리는 중..</h6>
        <p className='body2-14-medium text-text-neutral-secondary mt-[1.2rem]'>
          {`도우미가 리포트 작성중이에요.\n최대 3시간까지 소요될 수 있어요.`}
        </p>
      </div>
      <img src='/images/report.svg' alt='리포트 기다리는 중' />
    </div>
  );
};

export default ReportInfoCard;
