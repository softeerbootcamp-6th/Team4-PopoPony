import { IcAlertCircle } from '@icons';

const HelperSelectInfoCard = () => {
  return (
    <div className='bg-neutral-10 flex flex-col gap-[1rem] rounded-[0.8rem] p-[1.2rem]'>
      <div className='flex-start gap-[0.4rem]'>
        <IcAlertCircle />
        <span className='label2-14-bold text-text-neutral-secondary'>도우미를 선택해주세요.</span>
      </div>
      <p className='label2-14-medium text-text-neutral-secondary'>
        빠른 동행 준비를 위해서 도우미를 선택해주세요.
      </p>
    </div>
  );
};

export default HelperSelectInfoCard;
