// frontend/src/features/customer/components/recruitStep/step1.tsx
import { TwoOptionSelector, FormInput, LabeledSection, PhotoUpload } from '@components';
import { useWatch } from 'react-hook-form';
import { memo, useEffect } from 'react';

type Props = {
  onValidChange: (isValid: boolean) => void;
};

function isFilled(v: unknown) {
  return !(v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0));
}

const Step1 = memo(({ onValidChange }: Props) => {
  const nameValue = useWatch({ name: 'patientName' });
  const leftValue = useWatch({ name: 'step1' });
  const photoValue = useWatch({ name: 'photo' });

  // 필수 값 모두 채워졌는지 판단해서 상위로 전달
  useEffect(() => {
    const valid = isFilled(nameValue) && isFilled(leftValue) && isFilled(photoValue);
    onValidChange(valid);
  }, [nameValue, leftValue, photoValue, onValidChange]);

  return (
    <>
      <PhotoUpload name='photo' />
      <LabeledSection label='왼쪽' isChecked={!!leftValue}>
        <TwoOptionSelector
          name='step1'
          leftOption={{ label: '왼쪽', value: 'step1-left' }}
          rightOption={{ label: '오른쪽', value: 'step1-right' }}
        />
      </LabeledSection>
      <LabeledSection label='환자 이름' isChecked={!!nameValue}>
        <FormInput type='text' size='M' placeholder='이름 입력' name='patientName' />
      </LabeledSection>
    </>
  );
});

Step1.displayName = 'Step1';

export default Step1;
