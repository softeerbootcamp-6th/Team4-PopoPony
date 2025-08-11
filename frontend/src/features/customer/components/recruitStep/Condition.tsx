import { TwoOptionSelector, LabeledSection } from '@components';
import { useFormContext } from 'react-hook-form';
import { memo } from 'react';
import { FormLayout } from '@layouts';
import { useFormValidation } from '@hooks';
import { type RecruitStepProps, conditionSchema } from '@customer/types';
import { isNullOrUndefined } from '@utils';

//TODO: 현재 true, false 값이 문자열로 저장되어 있음. 이를 boolean으로 변환해야 함.

const Condition = memo(({ handleNextStep }: RecruitStepProps) => {
  const { values, isFormValid, markFieldAsTouched } = useFormValidation(conditionSchema);
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
        <LabeledSection label='부축' isChecked={!isNullOrUndefined(values.needsHelping)}>
          <div onClick={() => markFieldAsTouched('needsHelping')}>
            <TwoOptionSelector
              name='needsHelping'
              leftOption={{ label: '필요해요', value: 'true' }}
              rightOption={{ label: '필요없어요', value: 'false' }}
            />
          </div>
        </LabeledSection>
        <LabeledSection label='휠체어 사용' isChecked={!isNullOrUndefined(values.usesWheelchair)}>
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
