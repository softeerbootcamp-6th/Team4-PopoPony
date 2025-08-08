import { DetailFormSchema, type ProfileStepProps, CERTIFICATE_OPTIONS } from '@helper/types';
import { useFormValidation } from '@hooks';
import { FormLayout } from '@layouts';
import { LabeledSection, FormInput, MultiOptionSelector, Divider } from '@components';

const Detail = ({ handleNextStep }: ProfileStepProps) => {
  const { values, fieldErrors, isFormValid, markFieldAsTouched } =
    useFormValidation(DetailFormSchema);
  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>도우미의 상세 정보를 입력해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>
        <LabeledSection
          label='한 줄 소개'
          isChecked={!fieldErrors.shortBio && !!values.shortBio}
          message={fieldErrors.shortBio}>
          <FormInput
            type='text'
            name='shortBio'
            validation={() => markFieldAsTouched('shortBio')}
            placeholder='한 줄 소개를 입력해주세요'
          />
        </LabeledSection>
        <LabeledSection
          label='자격 사항'
          isChecked={!fieldErrors.certificateList && values.certificateList.length > 0}
          message={fieldErrors.certificateList}>
          <div onClick={() => markFieldAsTouched('certificateList')}>
            <MultiOptionSelector
              name='certificateList'
              options={CERTIFICATE_OPTIONS.map((option) => {
                return { label: option, value: option };
              })}
            />
          </div>
        </LabeledSection>
        <Divider />
      </FormLayout.Content>
    </FormLayout>
  );
};

export default Detail;
