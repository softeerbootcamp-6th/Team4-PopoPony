import { FormLayout } from '@layouts';
import type { FunnelStepProps } from '@types';
import { ReceiptImageUpload } from '@helper/components';
import { useFormContext, useWatch } from 'react-hook-form';
import { formatValue } from '@utils';

const Taxi = ({ handleNextStep }: FunnelStepProps) => {
  const { register, control, watch } = useFormContext();

  const departureFee = useWatch({
    control,
    name: 'taxiFeeCreateRequest.departureFee',
  });
  const returnFee = useWatch({
    control,
    name: 'taxiFeeCreateRequest.returnFee',
  });

  const departureReceipt = watch('taxiFeeCreateRequest.departureReceipt');
  const returnReceipt = watch('taxiFeeCreateRequest.returnReceipt');

  const isValid = departureFee && returnFee && departureReceipt.s3Key && returnReceipt.s3Key;

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
            <div
              className={`border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20 relative flex h-[5.1rem] w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] focus-within:ring-[0.3rem]`}>
              <input
                type='text'
                className='body1-16-medium text-text-neutral-primary placeholder:text-text-neutral-assistive w-full min-w-0 flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                placeholder='택시 요금'
                {...register('taxiFeeCreateRequest.departureFee', {
                  onChange: (e) => {
                    const formattedValue = formatValue(e.target.value, 'cost');
                    e.target.value = formattedValue;
                  },
                })}
              />
              <div className='body1-16-medium text-text-neutral-assistive ml-[0.8rem] select-none'>
                원
              </div>
            </div>
            <ReceiptImageUpload
              name='taxiFeeCreateRequest.departureReceipt'
              prefix='uploads/taxi'
              placeholder='만남-병원'
            />
          </div>
          <div className='flex flex-col gap-[0.8rem]'>
            <span className='body2-14-medium text-text-neutral-secondary'>병원-복귀 요금</span>
            <div
              className={`border-stroke-neutral-dark bg-background-default-white focus-within:border-stroke-mint focus-within:ring-stroke-mint/20 relative flex h-[5.1rem] w-full items-center rounded-[0.8rem] border px-[1.6rem] transition-[color,box-shadow] focus-within:ring-[0.3rem]`}>
              <input
                type='text'
                className='body1-16-medium text-text-neutral-primary placeholder:text-text-neutral-assistive w-full min-w-0 flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                placeholder='택시 요금'
                {...register('taxiFeeCreateRequest.returnFee', {
                  onChange: (e) => {
                    const formattedValue = formatValue(e.target.value, 'cost');
                    e.target.value = formattedValue;
                  },
                })}
              />
              <div className='body1-16-medium text-text-neutral-assistive ml-[0.8rem] select-none'>
                원
              </div>
            </div>
            <ReceiptImageUpload
              name='taxiFeeCreateRequest.returnReceipt'
              prefix='uploads/taxi'
              placeholder='병원-복귀'
            />
          </div>
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={!isValid} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Taxi;
