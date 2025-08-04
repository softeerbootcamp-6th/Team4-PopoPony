// frontend/src/features/customer/components/recruitStep/step1.tsx
import { TwoOptionSelector, FormInput, LabeledSection, PhotoUpload, Button } from '@components';
import { useWatch } from 'react-hook-form';
import { memo } from 'react';
import { FormLayout } from '@layouts';
//import { type Step1FormValues } from '@types';

type Props = {
  handleNextStep: () => void;
};

const Step1 = memo(({ handleNextStep }: Props) => {
  const nameValue = useWatch({ name: 'patientName' });
  const ageValue = useWatch({ name: 'patientAge' });
  const contactValue = useWatch({ name: 'patientContact' });
  const sexValue = useWatch({ name: 'patientSex' });
  const profileImageUrl = useWatch({ name: 'profileImageUrl' });

  return (
    <>
      <FormLayout>
        <FormLayout.Content>
          <FormLayout.TitleWrapper>
            <FormLayout.Title>동행할 환자의 기본정보를 입력해주세요</FormLayout.Title>
          </FormLayout.TitleWrapper>
          <Button variant='assistive'>이전 환자 정보 불러오기</Button>
          <div className='flex-center w-full'>
            <PhotoUpload name='profileImageUrl' />
          </div>
          <div className='flex gap-[1.2rem]'>
            <LabeledSection label='환자 이름' isChecked={!!nameValue}>
              <FormInput type='text' size='M' placeholder='이름 입력' name='patientName' />
            </LabeledSection>
            <LabeledSection label='환자 나이' isChecked={!!ageValue}>
              <FormInput
                type='number'
                size='M'
                placeholder='나이 입력'
                description='세'
                name='patientAge'
              />
            </LabeledSection>
          </div>
          <LabeledSection label='환자 성별' isChecked={!!sexValue}>
            <TwoOptionSelector
              name='patientSex'
              leftOption={{ label: '남자', value: 'male' }}
              rightOption={{ label: '여자', value: 'female' }}
            />
          </LabeledSection>
          <LabeledSection label='환자 연락처' isChecked={!!contactValue}>
            <FormInput type='contact' size='M' placeholder='연락처 입력' name='patientContact' />
          </LabeledSection>
        </FormLayout.Content>
        <FormLayout.Footer>
          <Button
            variant='primary'
            onClick={handleNextStep}
            disabled={!(nameValue && ageValue && sexValue && contactValue && profileImageUrl)}>
            다음
          </Button>
        </FormLayout.Footer>
      </FormLayout>
    </>
  );
});

Step1.displayName = 'Step1';

export default Step1;
