import { TwoOptionSelector, FormInput, LabeledSection, PhotoUpload, Button } from '@components';
import { memo } from 'react';
import { FormLayout } from '@layouts';
import { z } from 'zod';
import { useFormValidation } from '@customer/hooks';
import type { RecruitStepProps } from '@customer/types';

const profileSchema = z.object({
  patientName: z.string().min(2, { message: '올바른 이름을 입력해주세요' }),
  patientAge: z
    .string()
    .min(1, { message: '나이를 입력해주세요' })
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 150;
      },
      { message: '올바른 나이를 입력해주세요' }
    ),
  patientContact: z.string().min(12, { message: '숫자만 입력해주세요' }),
  patientSex: z.enum(['male', 'female'], { message: '성별을 선택해주세요' }),
  profileImageUrl: z.string().min(1, { message: '프로필 이미지를 선택해주세요' }),
});

const Profile = memo(({ handleNextStep }: RecruitStepProps) => {
  const { values, fieldErrors, isFormValid, markFieldAsTouched } = useFormValidation(profileSchema);

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>동행할 환자의 기본정보를 입력해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>

        <Button size='lg' className='min-h-[5.6rem]' variant='assistive'>
          이전 환자 정보 불러오기
        </Button>

        <LabeledSection
          label='프로필 이미지'
          isChecked={!fieldErrors.profileImageUrl && !!values.profileImageUrl}
          message={fieldErrors.profileImageUrl}>
          <div className='flex-center w-full'>
            <PhotoUpload name='profileImageUrl' />
          </div>
        </LabeledSection>

        <div className='flex flex-col gap-[1.2rem] sm:flex-row'>
          <LabeledSection
            label='환자 이름'
            isChecked={!fieldErrors.patientName && !!values.patientName}
            message={fieldErrors.patientName}>
            <FormInput
              type='text'
              size='M'
              placeholder='이름 입력'
              name='patientName'
              validation={() => markFieldAsTouched('patientName')}
            />
          </LabeledSection>

          <LabeledSection
            label='환자 나이'
            isChecked={!fieldErrors.patientAge && !!values.patientAge}
            message={fieldErrors.patientAge}>
            <FormInput
              type='number'
              size='M'
              placeholder='나이 입력'
              description='세'
              name='patientAge'
              validation={() => markFieldAsTouched('patientAge')}
            />
          </LabeledSection>
        </div>

        <LabeledSection
          label='환자 성별'
          isChecked={!fieldErrors.patientSex && !!values.patientSex}>
          <div onClick={() => markFieldAsTouched('patientSex')}>
            <TwoOptionSelector
              name='patientSex'
              leftOption={{ label: '남자', value: 'male' }}
              rightOption={{ label: '여자', value: 'female' }}
            />
          </div>
        </LabeledSection>

        <LabeledSection
          label='환자 연락처'
          isChecked={!fieldErrors.patientContact && !!values.patientContact}
          message={fieldErrors.patientContact}>
          <FormInput
            type='contact'
            size='M'
            placeholder='연락처 입력'
            name='patientContact'
            validation={() => markFieldAsTouched('patientContact')}
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

Profile.displayName = 'Profile';
export default Profile;
