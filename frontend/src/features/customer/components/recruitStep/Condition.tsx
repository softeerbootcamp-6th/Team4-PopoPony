import { TwoOptionSelector, LabeledSection } from '@shared/ui/form';
import { useFormContext } from 'react-hook-form';
import { memo } from 'react';
import { FormLayout } from '@shared/ui/layout';
import { useFormValidation } from '@shared/hooks';
import { conditionSchema } from '@customer/types';
import type { FunnelStepProps } from '@shared/types';

const Condition = memo(({ handleNextStep }: FunnelStepProps) => {
  const { values, isFormValid, fieldErrors, markFieldAsTouched } =
    useFormValidation(conditionSchema);
  const { getValues } = useFormContext();
  const patientName = getValues('name');
  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            <span className='text-text-mint-primary'>{patientName} 환자</span>의 안전한 동행을 위해,
            보행 상태를 알려주세요
          </FormLayout.Title>
        </FormLayout.TitleWrapper>
        <LabeledSection label='부축' isChecked={!fieldErrors.needsHelping && !!values.needsHelping}>
          <div onClick={() => markFieldAsTouched('needsHelping')}>
            <TwoOptionSelector
              name='needsHelping'
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
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={!isFormValid} />
      </FormLayout.Footer>
    </FormLayout>
  );
});

export default Condition;
