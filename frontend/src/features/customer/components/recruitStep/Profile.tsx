import { TwoOptionSelector, FormInput, LabeledSection, PhotoUpload, Button } from '@components';
import { memo } from 'react';
import { FormLayout } from '@layouts';
import { useFormValidation } from '@hooks';
import { profileSchema } from '@customer/types';
import type { FunnelStepProps } from '@types';

const Profile = memo(({ handleNextStep }: FunnelStepProps) => {
  const { values, fieldErrors, isFormValid, markFieldAsTouched } = useFormValidation(profileSchema);

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>동행할 환자의 기본정보를 입력해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>

        <Button size='lg' variant='assistive' onClick={() => alert('준비중인 기능이에요')}>
          이전 환자 정보 불러오기
        </Button>

        <LabeledSection
          label='프로필 이미지'
          isChecked={!fieldErrors.profileImageCreateRequest && !!values.profileImageCreateRequest}
          message={fieldErrors.profileImageCreateRequest}>
          <div className='flex-center w-full'>
            <PhotoUpload name='profileImageCreateRequest' prefix='uploads/patient' />
          </div>
        </LabeledSection>

        <div className='flex gap-[1.2rem]'>
          <LabeledSection
            label='환자 이름'
            isChecked={!fieldErrors.name && !!values.name}
            message={fieldErrors.name}>
            <FormInput
              type='text'
              size='M'
              placeholder='이름 입력'
              name='name'
              validation={() => markFieldAsTouched('name')}
            />
          </LabeledSection>

          <LabeledSection
            label='환자 나이'
            isChecked={!fieldErrors.age && !!values.age}
            message={fieldErrors.age}>
            <FormInput
              type='number'
              size='M'
              placeholder='나이 입력'
              description='세'
              name='age'
              validation={() => markFieldAsTouched('age')}
            />
          </LabeledSection>
        </div>

        <LabeledSection label='환자 성별' isChecked={!fieldErrors.gender && !!values.gender}>
          <div onClick={() => markFieldAsTouched('gender')}>
            <TwoOptionSelector
              name='gender'
              leftOption={{ label: '남자', value: '남자' }}
              rightOption={{ label: '여자', value: '여자' }}
            />
          </div>
        </LabeledSection>

        <LabeledSection
          label='환자 연락처'
          isChecked={!fieldErrors.phoneNumber && !!values.phoneNumber}
          message={fieldErrors.phoneNumber}>
          <FormInput
            type='contact'
            size='M'
            placeholder='연락처 입력'
            name='phoneNumber'
            validation={() => markFieldAsTouched('phoneNumber')}
          />
        </LabeledSection>
      </FormLayout.Content>

      <FormLayout.Footer>
        <Button variant='primary' onClick={handleNextStep} disabled={!isFormValid}>
          다음
        </Button>
      </FormLayout.Footer>
    </FormLayout>
  );
});

export default Profile;
