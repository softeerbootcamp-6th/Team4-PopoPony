import { FormInput } from '@components';
import { FormLayout } from '@layouts';
import type { FunnelStepProps } from '@types';
import { ReceiptImageUpload } from '@helper/components';

const Taxi = ({ handleNextStep }: FunnelStepProps) => {
  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            택시 요금과 영수증을
            <br />
            함께 제출해주세요
          </FormLayout.Title>
          <FormLayout.SubTitle>
            영수증의 글자가 잘 보일 수 있도록 찍어주세요. 리포트 전달 이후 수익금과 함께 전달될
            예정이에요.
          </FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <div className='flex gap-[1.2rem]'>
          <div className='flex flex-col gap-[0.8rem]'>
            <span className='body2-14-medium text-text-neutral-secondary'>만남-병원 요금</span>
            <FormInput
              type='cost'
              size='M'
              name='departureFee'
              placeholder='택시 요금'
              validation={() => {}}
            />
            <ReceiptImageUpload
              name='departureReceipt'
              prefix='uploads/taxi'
              placeholder='만남-병원'
            />
          </div>
          <div className='flex flex-col gap-[0.8rem]'>
            <span className='body2-14-medium text-text-neutral-secondary'>병원-복귀 요금</span>
            <FormInput
              type='cost'
              size='M'
              name='returnFee'
              placeholder='택시 요금'
              validation={() => {}}
            />
            <ReceiptImageUpload
              name='returnReceipt'
              prefix='uploads/taxi'
              placeholder='병원-복귀'
            />
          </div>
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={false} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Taxi;
