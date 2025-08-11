import { TwoOptionSelector, LabeledSection, MultiOptionSelectorCol, FormInput } from '@components';
import { useFormContext, useWatch } from 'react-hook-form';
import { memo, useEffect, useRef } from 'react';
import { FormLayout } from '@layouts';
import { useFormValidation } from '@hooks';
import type { RecruitStepProps } from '@customer/types';
import { COGNITIVE_ISSUES_OPTIONS, CognitiveSchema, CommunicationSchema } from '@customer/types';

const Communication = memo(({ handleNextStep }: RecruitStepProps) => {
  const { setValue, control } = useFormContext();
  const {
    values: communicationValues,
    fieldErrors: communicationFieldErrors,
    isFormValid: communicationIsFormValid,
    markFieldAsTouched: communicationMarkFieldAsTouched,
  } = useFormValidation(CommunicationSchema);
  const {
    values: cognitiveValues,
    fieldErrors: cognitiveFieldErrors,
    isFormValid: cognitiveIsFormValid,
    markFieldAsTouched: cognitiveMarkFieldAsTouched,
  } = useFormValidation(CognitiveSchema);

  // 개별 필드 감시 및 자동 초기화
  const cognitiveAbility = useWatch({ control, name: 'hasCognitiveIssue' });
  const communicationAbility = useWatch({ control, name: 'hasCommunicationIssue' });

  // 이전 값 추적을 위한 ref
  const prevCognitiveAbility = useRef(cognitiveAbility);
  const prevCommunicationAbility = useRef(communicationAbility);

  // 값이 'good'으로 변경될 때만 초기화
  useEffect(() => {
    if (
      cognitiveValues.hasCognitiveIssue === 'true' &&
      prevCognitiveAbility.current !== cognitiveAbility
    ) {
      setValue('cognitiveIssueDetail', []);
    }
    prevCognitiveAbility.current = cognitiveAbility;
  }, [cognitiveAbility, setValue]);

  useEffect(() => {
    if (
      communicationValues.hasCommunicationIssue === 'true' &&
      prevCommunicationAbility.current !== communicationAbility
    ) {
      setValue('communicationIssueDetail', '');
    }
    prevCommunicationAbility.current = communicationAbility;
  }, [communicationAbility, setValue]);

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>
            적합한 도우미가 지원할 수 있도록 의사소통 능력을 알려주세요
          </FormLayout.Title>
          <FormLayout.SubTitle>경미한 단계여도 반드시 체크해주세요</FormLayout.SubTitle>
        </FormLayout.TitleWrapper>
        <LabeledSection
          label='인지 능력'
          isChecked={
            !cognitiveFieldErrors.hasCognitiveIssue && !!cognitiveValues.hasCognitiveIssue
          }>
          <div onClick={() => cognitiveMarkFieldAsTouched('hasCognitiveIssue')}>
            <TwoOptionSelector
              name='hasCognitiveIssue'
              leftOption={{ label: '괜찮아요', value: 'false' }}
              rightOption={{ label: '도움이 필요해요', value: 'true' }}
            />
          </div>
        </LabeledSection>
        {cognitiveValues.hasCognitiveIssue === 'true' && (
          <LabeledSection
            label='구체적인 문제점'
            isChecked={
              !cognitiveFieldErrors.cognitiveIssueDetail &&
              !!cognitiveValues.cognitiveIssueDetail?.length
            }>
            <div onClick={() => cognitiveMarkFieldAsTouched('cognitiveIssueDetail')}>
              <MultiOptionSelectorCol
                name='cognitiveIssueDetail'
                options={COGNITIVE_ISSUES_OPTIONS.map((option) => ({
                  label: option,
                  value: option,
                }))}
              />
            </div>
          </LabeledSection>
        )}
        <LabeledSection
          label='의사소통 능력'
          isChecked={
            !communicationFieldErrors.hasCommunicationIssue &&
            !!communicationValues.hasCommunicationIssue
          }>
          <div onClick={() => communicationMarkFieldAsTouched('hasCommunicationIssue')}>
            <TwoOptionSelector
              name='hasCommunicationIssue'
              leftOption={{ label: '괜찮아요', value: 'false' }}
              rightOption={{ label: '도움이 필요해요', value: 'true' }}
            />
          </div>
        </LabeledSection>
        {communicationValues.hasCommunicationIssue === 'true' && (
          <LabeledSection
            label='의사소통 도움'
            isChecked={
              !communicationFieldErrors.communicationIssueDetail &&
              !!communicationValues.communicationIssueDetail
            }
            message={communicationFieldErrors.communicationIssueDetail}>
            <FormInput
              type='text'
              size='M'
              placeholder='필요하신 도움을 작성해주세요'
              name='communicationIssueDetail'
              validation={() => communicationMarkFieldAsTouched('communicationIssueDetail')}
            />
          </LabeledSection>
        )}
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext
          handleClickNext={handleNextStep}
          disabled={!communicationIsFormValid || !cognitiveIsFormValid}
        />
      </FormLayout.Footer>
    </FormLayout>
  );
});

export default Communication;
