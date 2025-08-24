import { useState } from 'react';
import { DashBoardCard } from '@dashboard/components';
import { IcTaxiCalled, IcTaxiWaiting } from '@icons';
import { Button } from '@shared/components';
import { WarningBox } from '@customer/components';

const HelperDashboardTaxiCard = ({
  estimatedTaxiTime,
  estimatedTaxiFee,
}: {
  estimatedTaxiTime: number;
  estimatedTaxiFee: number;
}) => {
  const [taxiStatus, setTaxiStatus] = useState<'called' | 'waiting'>('called');
  return (
    <DashBoardCard.Card>
      <h4 className='title-20-bold text-text-neutral-primary'>택시를 호출하세요</h4>
      <div className='flex w-full justify-center'>
        {taxiStatus === 'called' && <IcTaxiCalled className='w-full' />}
        {taxiStatus === 'waiting' && <IcTaxiWaiting className='w-full' />}
      </div>
      <div className='bg-neutral-20 mt-[2.8rem] flex w-full gap-[0.1rem]'>
        <div className='bg-background-default-white flex-center flex flex-1 flex-col gap-[0.4rem]'>
          <h6 className='body2-14-medium text-text-neutral-secondar'>예상 소요시간</h6>
          <h6 className='subtitle-18-bold text-text-neutral-primary'>
            {Math.floor(estimatedTaxiTime / 60)}분
          </h6>
        </div>
        <div className='bg-background-default-white flex-center flex flex-1 flex-col gap-[0.4rem]'>
          <h6 className='body2-14-medium text-text-neutral-secondary'>예상 금액</h6>
          <h6 className='subtitle-18-bold text-text-neutral-primary'>
            {estimatedTaxiFee.toLocaleString()}원
          </h6>
        </div>
      </div>
      <div className='mt-[1.6rem] w-full'>
        {taxiStatus === 'called' && (
          <Button variant='secondary' size='md' onClick={() => setTaxiStatus('waiting')}>
            택시 호출하기
          </Button>
        )}
        {taxiStatus === 'waiting' && (
          <Button variant='assistive' size='md' onClick={() => setTaxiStatus('called')}>
            취소하기
          </Button>
        )}
      </div>
      <WarningBox text='택시는 도우미님이 직접 결제하시고, 반드시 영수증을 받아주세요!' />
    </DashBoardCard.Card>
  );
};

export default HelperDashboardTaxiCard;
