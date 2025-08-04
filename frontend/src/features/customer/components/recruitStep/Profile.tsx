// frontend/src/features/customer/components/recruitStep/step1.tsx
import { TwoOptionSelector, FormInput, LabeledSection, PhotoUpload, Button } from '@components';
import { useWatch, useFormContext } from 'react-hook-form';
import { memo, useState, useEffect } from 'react';
import { FormLayout } from '@layouts';
import { z } from 'zod';

type Props = {
  handleNextStep: () => void;
};

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
  patientContact: z.string().min(10, { message: '연락처를 입력해주세요' }),
  patientSex: z.enum(['male', 'female'], { message: '성별을 선택해주세요' }),
  profileImageUrl: z.string().min(1, { message: '프로필 이미지를 선택해주세요' }),
});

const Profile = memo(({ handleNextStep }: Props) => {
  const { getValues } = useFormContext();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const nameValue = useWatch({ name: 'patientName' });
  const ageValue = useWatch({ name: 'patientAge' });
  const contactValue = useWatch({ name: 'patientContact' });
  const sexValue = useWatch({ name: 'patientSex' });
  const profileImageUrl = useWatch({ name: 'profileImageUrl' });

  // 실시간 유효성 검사
  useEffect(() => {
    const validateField = (fieldName: string, value: unknown) => {
      const fieldSchema = profileSchema.shape[fieldName as keyof typeof profileSchema.shape];
      if (fieldSchema) {
        const result = fieldSchema.safeParse(value);
        if (!result.success) {
          return result.error.issues[0].message;
        }
      }
      return null;
    };

    const errors: Record<string, string> = {};

    // 각 필드별 유효성 검사 (touched된 필드만)
    if (touchedFields.patientName) {
      const nameError = validateField('patientName', nameValue);
      if (nameError) errors.patientName = nameError;
    }

    if (touchedFields.patientAge) {
      const ageError = validateField('patientAge', ageValue);
      if (ageError) errors.patientAge = ageError;
    }

    if (touchedFields.patientContact) {
      const contactError = validateField('patientContact', contactValue);
      if (contactError) errors.patientContact = contactError;
    }

    if (touchedFields.patientSex) {
      const sexError = validateField('patientSex', sexValue);
      if (sexError) errors.patientSex = sexError;
    }

    if (touchedFields.profileImageUrl) {
      const imageError = validateField('profileImageUrl', profileImageUrl);
      if (imageError) errors.profileImageUrl = imageError;
    }

    setFieldErrors(errors);

    // 전체 폼 유효성 검사
    const formData = getValues();
    const formResult = profileSchema.safeParse(formData);
    setIsFormValid(formResult.success);
  }, [nameValue, ageValue, contactValue, sexValue, profileImageUrl, touchedFields, getValues]);

  return (
    <>
      <FormLayout>
        <FormLayout.Content>
          <FormLayout.TitleWrapper>
            <FormLayout.Title>동행할 환자의 기본정보를 입력해주세요</FormLayout.Title>
          </FormLayout.TitleWrapper>
          <Button variant='assistive'>이전 환자 정보 불러오기</Button>
          <LabeledSection
            label='프로필 이미지'
            isChecked={!fieldErrors.profileImageUrl && !!profileImageUrl}
            message={fieldErrors.profileImageUrl}>
            <div className='flex-center w-full'>
              <PhotoUpload name='profileImageUrl' />
            </div>
          </LabeledSection>
          <div className='flex gap-[1.2rem]'>
            <LabeledSection
              label='환자 이름'
              isChecked={!fieldErrors.patientName && !!nameValue}
              message={fieldErrors.patientName}>
              <FormInput
                type='text'
                size='M'
                placeholder='이름 입력'
                name='patientName'
                onBlur={() => setTouchedFields((prev) => ({ ...prev, patientName: true }))}
              />
            </LabeledSection>
            <LabeledSection
              label='환자 나이'
              isChecked={!fieldErrors.patientAge && !!ageValue}
              message={fieldErrors.patientAge}>
              <FormInput
                type='number'
                size='M'
                placeholder='나이 입력'
                description='세'
                name='patientAge'
                onBlur={() => setTouchedFields((prev) => ({ ...prev, patientAge: true }))}
              />
            </LabeledSection>
          </div>
          <LabeledSection
            label='환자 성별'
            isChecked={!fieldErrors.patientSex && !!sexValue}
            message={fieldErrors.patientSex}>
            <div onClick={() => setTouchedFields((prev) => ({ ...prev, patientSex: true }))}>
              <TwoOptionSelector
                name='patientSex'
                leftOption={{ label: '남자', value: 'male' }}
                rightOption={{ label: '여자', value: 'female' }}
              />
            </div>
          </LabeledSection>
          <LabeledSection
            label='환자 연락처'
            isChecked={!fieldErrors.patientContact && !!contactValue}
            message={fieldErrors.patientContact}>
            <FormInput
              type='contact'
              size='M'
              placeholder='연락처 입력'
              name='patientContact'
              onBlur={() => setTouchedFields((prev) => ({ ...prev, patientContact: true }))}
            />
          </LabeledSection>
        </FormLayout.Content>
        <FormLayout.Footer>
          <Button variant='primary' onClick={handleNextStep} disabled={!isFormValid}>
            다음
          </Button>
        </FormLayout.Footer>
      </FormLayout>
    </>
  );
});

Profile.displayName = 'Profile';

export default Profile;
