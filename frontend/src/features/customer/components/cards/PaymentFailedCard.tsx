import { call } from '@shared/lib';
import { Button } from '@shared/ui';

const PaymentFailedCard = () => {
  return (
    <div className='border-stroke-neutral-dark bg-background-light-neutral flex-col-start gap-[2rem] rounded-[0.8rem] border p-[2rem]'>
      <div className='flex-between gap-[1.5rem]'>
        <div>
          <h6 className='body1-16-bold text-text-neutral-secondary'>결제에 실패했어요</h6>
          <p className='body2-14-medium text-text-neutral-secondary mt-[1.2rem]'>
            {`이전에 등록한 결제수단으로 요금 결제에 실패했어요. 결제 후에 동행 리포트를 열람하실 수 있어요.`}
          </p>
        </div>
        <img src='/images/card-failed.svg' alt='결제 실패' />
      </div>
      <Button variant='assistive' size='md' onClick={() => call('010-2514-9058')}>
        고객센터 연락하기
      </Button>
    </div>
  );
};

export default PaymentFailedCard;
