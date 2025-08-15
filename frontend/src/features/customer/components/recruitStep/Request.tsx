import { type RecruitStepProps, requestFormSchema } from '@customer/types';
import { FormTextarea, LabeledSection } from '@components';
import { FormLayout } from '@layouts';
import { useFormValidation } from '@hooks';

const Request = ({ handleNextStep }: RecruitStepProps) => {
  const { values, fieldErrors, isFormValid, markFieldAsTouched } =
    useFormValidation(requestFormSchema);

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>요청 사항이 있나요?</FormLayout.Title>
          <FormLayout.SubTitle>작성해주신 요청사항은 도우미에게 전달돼요.</FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <LabeledSection label='요청 사항' isChecked={!fieldErrors.purpose && !!values.purpose}>
          <FormTextarea
            name='purpose'
            placeholder='병원에 방문한 목적과 수행 업무에 대해서 알려주세요.'
            validation={() => markFieldAsTouched('purpose')}
          />
        </LabeledSection>
        <LabeledSection
          label='요청 사항'
          isChecked={!fieldErrors.extraRequest && !!values.extraRequest}>
          <FormTextarea
            name='extraRequest'
            placeholder='수납 대행, 다음 진료 예약, 원무과 서류 작업 등 요청 사항을 알려주세요.'
            validation={() => markFieldAsTouched('extraRequest')}
          />
        </LabeledSection>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={!isFormValid} />
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default Request;
