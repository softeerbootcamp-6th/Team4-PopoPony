// frontend/src/features/customer/components/recruitStep/step1.tsx
import { TwoOptionSelector, FormInput, LabeledSection, PhotoUpload, Button } from '@components';
import { useWatch } from 'react-hook-form';
import { memo } from 'react';
import { FormLayout } from '@layouts';

type Props = {
  handleNextStep: () => void;
};

const Step1 = memo(({ handleNextStep }: Props) => {
  const nameValue = useWatch({ name: 'patientName' });
  const leftValue = useWatch({ name: 'step1' });
  const photoValue = useWatch({ name: 'photo' });

  // // 필수 값 모두 채워졌는지 판단해서 상위로 전달

  return (
    <>
      <FormLayout>
        <FormLayout.Content>
          <FormLayout.Title>동행할 환자의 기본정보를 입력해주세요</FormLayout.Title>
          <FormLayout.SubTitle>
            <Button variant='assistive'>이전 환자 정보 불러오기</Button>
          </FormLayout.SubTitle>
          <div className='flex-center w-full'>
            <PhotoUpload name='photo' />
          </div>
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
        </FormLayout.Content>
        <FormLayout.Footer>
          <Button
            variant='primary'
            onClick={handleNextStep}
            disabled={!(leftValue && nameValue && photoValue)}>
            다음
          </Button>
        </FormLayout.Footer>
      </FormLayout>
    </>
  );
});

Step1.displayName = 'Step1';

export default Step1;
