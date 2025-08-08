import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { RegionFormSchema, type ProfileStepProps, REGION_OPTIONS } from '@helper/types';
import { useFormValidation } from '@hooks';
import { FormLayout } from '@layouts';
import { LabeledSection, PhotoUpload, Button } from '@components';
import { RegionBottomSheet } from '@helper/components';
import { IcChevronDown } from '@assets/icons';

const Region = ({ handleNextStep }: ProfileStepProps) => {
  const { register } = useFormContext();
  const { values, fieldErrors, isFormValid } = useFormValidation(RegionFormSchema);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // 고유한 key를 생성하는 함수
  const getUniqueKey = (value: string, index: number): string => {
    return `region-${value}-${index}`;
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>프로필을 작성해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>
        <div className='flex-center w-full'>
          <PhotoUpload name='imageUrl' />
        </div>
        <LabeledSection
          label='선호 활동 지역'
          isChecked={!fieldErrors.region && !!values.region}
          message={fieldErrors.region}>
          <RegionBottomSheet name='region'>
            <button className='flex-between border-b-neutral-20 w-full border-b-2 pb-[0.8rem]'>
              <p
                className={`title-20-medium ${
                  values.region ? 'text-text-neutral-primary' : 'text-text-neutral-assistive'
                }`}>
                {REGION_OPTIONS.find((option) => option.value === values.region)?.value ||
                  '지역 선택'}
              </p>
              <IcChevronDown
                className={`[&_path]:stroke-icon-neutral-secondary [&_path]:fill-icon-neutral-secondary h-[2.4rem] w-[2.4rem] ${
                  isBottomSheetOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </RegionBottomSheet>
        </LabeledSection>
      </FormLayout.Content>
      <FormLayout.Footer>
        <Button variant='primary' onClick={handleNextStep} disabled={!isFormValid}>
          다음
        </Button>
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Region;
