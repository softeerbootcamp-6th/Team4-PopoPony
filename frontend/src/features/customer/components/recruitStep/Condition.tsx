import { TwoOptionSelector, LabeledSection, Button } from '@components';
import { useFormContext } from 'react-hook-form';
import { memo } from 'react';
import { FormLayout } from '@layouts';
import { useFormValidation } from '@customer/hooks';
import { z } from 'zod';
import type { RecruitStepProps } from '@customer/types';

//TODO: 현재 true, false 값이 문자열로 저장되어 있음. 이를 boolean으로 변환해야 함.

const conditionSchema = z.object({
  needsPhysicalSupport: z.string(),
  usesWheelchair: z.string(),
});

const Condition = memo(({ handleNextStep, handleBackStep }: RecruitStepProps) => {
  const { values, fieldErrors, isFormValid, markFieldAsTouched } =
    useFormValidation(conditionSchema);
  const { getValues } = useFormContext();
  const patientName = getValues('patientName');
  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            <span className='text-text-mint-primary'>{patientName} 환자</span>의 안전한 동행을 위해,
            보행 상태를 알려주세요
          </FormLayout.Title>
        </FormLayout.TitleWrapper>
        <LabeledSection
          label='부축'
          isChecked={!fieldErrors.needsPhysicalSupport && !!values.needsPhysicalSupport}>
          <div onClick={() => markFieldAsTouched('needsPhysicalSupport')}>
            <TwoOptionSelector
              name='needsPhysicalSupport'
              leftOption={{ label: '필요해요', value: 'true' }}
              rightOption={{ label: '필요없어요', value: 'false' }}
            />
          </div>
        </LabeledSection>
        <LabeledSection
          label='휠체어 사용'
          isChecked={!fieldErrors.usesWheelchair && !!values.usesWheelchair}>
          <div onClick={() => markFieldAsTouched('usesWheelchair')}>
            <TwoOptionSelector
              name='usesWheelchair'
              leftOption={{ label: '필요해요', value: 'true' }}
              rightOption={{ label: '필요없어요', value: 'false' }}
            />
          </div>
        </LabeledSection>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterButtonWrapper>
          <Button variant='secondary' width='10rem' onClick={handleBackStep}>
            이전
          </Button>
          <Button
            className='flex-1'
            variant='primary'
            onClick={handleNextStep}
            disabled={!isFormValid}>
            다음
          </Button>
        </FormLayout.FooterButtonWrapper>
      </FormLayout.Footer>
    </FormLayout>
  );
});

export default Condition;
