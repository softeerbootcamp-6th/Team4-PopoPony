import { IcTaxiBadge } from '@icons';

import { secondsToTime } from '@shared/lib';

interface TaxiInfoProps {
  time: number;
  price: number;
}

const TaxiInfo = ({ time, price }: TaxiInfoProps) => {
  return (
    <div className='flex gap-[1.2rem]'>
      <div className='flex-col-start gap-[0.8rem]'>
        <IcTaxiBadge width={24} height={24} className='min-h-[2.4rem] min-w-[2.4rem]' />
        <div className='border-stroke-neutral-dark h-full w-[0.1rem] border border-dashed' />
      </div>
      <div className='flex flex-col gap-[0.8rem]'>
        <p className='subtitle-18-bold text-text-neutral-primary'>택시 탑승</p>
        <div className='body1-16-medium text-text-neutral-primary flex flex-col gap-[0.4rem]'>
          <div className='flex-start gap-[2rem]'>
            <p className='text-text-neutral-assistive w-[9rem]'>예상 소요시간</p>
            <p>{secondsToTime(time)}</p>
          </div>
          <div className='flex-start gap-[2rem]'>
            <p className='text-text-neutral-assistive w-[9rem]'>예상 금액</p>
            <p>{price.toLocaleString()}원</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxiInfo;
