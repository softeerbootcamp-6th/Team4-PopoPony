import { useState } from 'react';
import { RegionFormSchema, type ProfileStepProps, REGION_OPTIONS } from '@helper/types';
import { useFormValidation } from '@hooks';
import { FormLayout } from '@layouts';
import { LabeledSection, PhotoUpload, Button } from '@components';
import { RegionBottomSheetForm } from '@helper/components';
import { IcChevronDown } from '@assets/icons';

const Region = ({ handleNextStep }: ProfileStepProps) => {
  const { values, fieldErrors, isFormValid } = useFormValidation(RegionFormSchema);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>프로필을 작성해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>
        <div className='flex-center w-full'>
          <PhotoUpload name='profileImageCreateRequest' prefix='uploads/helper' />
        </div>
        <LabeledSection
          label='선호 활동 지역'
          isChecked={!fieldErrors.area && !!values.area}
          message={fieldErrors.area}>
          <RegionBottomSheet name='area'>
            <button
              className='flex-between border-b-neutral-20 w-full border-b-2 pb-[0.8rem]'
              onClick={() => setIsBottomSheetOpen((prev) => !prev)}>
              <p
                className={`title-20-medium ${
                  values.area ? 'text-text-neutral-primary' : 'text-text-neutral-assistive'
                }`}>
                {REGION_OPTIONS.find((option) => option.value === values.area)?.label ||
                  '지역 선택'}
              </p>
              <IcChevronDown
                className={`[&_path]:stroke-icon-neutral-secondary [&_path]:fill-icon-neutral-secondary h-[2.4rem] w-[2.4rem] ${
                  isBottomSheetOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </RegionBottomSheetForm>
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
