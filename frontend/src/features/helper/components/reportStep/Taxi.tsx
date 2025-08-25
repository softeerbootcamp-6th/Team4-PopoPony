import { useFormContext, useWatch } from 'react-hook-form';

import type { FunnelStepProps } from '@shared/types';
import { FormLayout } from '@shared/ui/layout';

import { TaxiFeeSection } from '@helper/components';

const MAX_TAXI_FEE_LENGTH = 8; // 원 단위 제외 9자리: 1,000,000원

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

  const isValid =
    departureFee &&
    returnFee &&
    departureReceipt.s3Key &&
    returnReceipt.s3Key &&
    departureFee.length < MAX_TAXI_FEE_LENGTH &&
    returnFee.length < MAX_TAXI_FEE_LENGTH;

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
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={!isValid} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Taxi;
