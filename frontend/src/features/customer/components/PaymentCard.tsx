import { Button, Divider } from '@components';

interface Props {
  usageFee: number;
  estimatedTaxiFare: number;
}

const PaymentCard = ({ usageFee, estimatedTaxiFare }: Props) => {
  const totalFee = usageFee + estimatedTaxiFare;
  return (
    <div className='bg-background-default-white flex-col-start shadow-card border-neutral-20 gap-[1.2rem] rounded-[1.2rem] border p-[1.6rem]'>
      <div className='bg-neutral-10 flex-center h-[17.3rem] w-full rounded-[0.8rem]'>지도</div>
      <div className='w-full gap-[0.8rem]'>
        <h6 className='label2-14-medium text-text-mint-primary'>결제 진행</h6>
        <div className='flex-between mt-[0.4rem]'>
          <span className='body1-16-bold text-text-neutral-primary'>기본 이용요금(3시간)</span>
          <span className='body1-16-medium text-text-neutral-primary'>
            ${usageFee.toLocaleString()}원
          </span>
        </div>
      </div>
      <Divider />
      <div className='mb-[0.8rem] w-full gap-[0.8rem]'>
        <h6 className='label2-14-medium text-text-mint-primary'>후불 결제</h6>
        <div className='flex-between mt-[0.4rem]'>
          <span className='body1-16-bold text-text-neutral-primary'>택시 이용요금(예상)</span>
          <span className='body1-16-medium text-text-neutral-primary'>
            ${estimatedTaxiFare.toLocaleString()}원
          </span>
        </div>
        <div className='flex-between mt-[0.4rem]'>
          <span className='body1-16-bold text-text-neutral-primary'>예상 최종금액</span>
          <span className='body1-16-medium text-text-neutral-primary'>
            ${totalFee.toLocaleString()}원
          </span>
        </div>
      </div>
      <Button>기본 요금 {usageFee.toLocaleString()}원 결제하기</Button>
    </div>
  );
};

export default PaymentCard;
