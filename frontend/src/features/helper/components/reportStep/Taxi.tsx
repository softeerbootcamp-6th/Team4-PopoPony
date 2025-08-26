import { useFormContext, useWatch } from 'react-hook-form';

import { toast } from 'sonner';

import type { FunnelStepProps } from '@shared/types';
import { FormLayout } from '@shared/ui/layout';

import { TaxiFeeSection } from '@helper/components';

const Taxi = ({ handleNextStep }: FunnelStepProps) => {
  const { control, watch } = useFormContext();

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

  const handleClickNext = () => {
    const departureFeeNumber = Number(departureFee.replace(/,/g, ''));
    const returnFeeNumber = Number(returnFee.replace(/,/g, ''));
    if (
      departureFeeNumber > 0 &&
      departureFeeNumber < 1000000 &&
      returnFeeNumber > 0 &&
      returnFeeNumber < 1000000
    ) {
      handleNextStep && handleNextStep();
    } else {
      toast.error('요금은 1,000,000원 이하로 입력해주세요.');
    }
  };

  const isValid =
    departureFee &&
    returnFee &&
    departureReceipt.s3Key &&
    returnReceipt.s3Key

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
          <TaxiFeeSection
            title='만남-병원 요금'
            feeFieldName='taxiFeeCreateRequest.departureFee'
            receiptFieldName='taxiFeeCreateRequest.departureReceipt'
            placeholder='만남-병원'
          />
          <TaxiFeeSection
            title='병원-복귀 요금'
            feeFieldName='taxiFeeCreateRequest.returnFee'
            receiptFieldName='taxiFeeCreateRequest.returnReceipt'
            placeholder='병원-복귀'
          />
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleClickNext} disabled={!isValid} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Taxi;
