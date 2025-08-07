import { TwoOptionSelector, LabeledSection, MultiOptionSelector, FormInput } from '@components';
import { useFormContext, useWatch } from 'react-hook-form';
import { memo, useEffect, useRef } from 'react';
import { FormLayout } from '@layouts';
import { useFormValidation } from '@customer/hooks';
import { z } from 'zod';
import type { RecruitStepProps } from '@customer/types';
import { COGNITIVE_ISSUES_OPTIONS } from '@customer/types';

const CognitiveSchema = z
  .object({
    cognitiveAbility: z.enum(['good', 'bad']),
    cognitiveIssues: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.cognitiveAbility === 'bad') {
        return data.cognitiveIssues && data.cognitiveIssues.length > 0;
      }
      return true;
    },
    {
      message: '구체적인 문제점을 선택해주세요',
      path: ['cognitiveIssues'],
    }
  );

const CommunicationSchema = z
  .object({
    communicationAbility: z.enum(['good', 'bad']),
    communicationHelp: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.communicationAbility === 'bad') {
        return data.communicationHelp && data.communicationHelp.length >= 10;
      }
      return true;
    },
    {
      message: '10자 이상 입력해주세요',
      path: ['communicationHelp'],
    }
  );
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
  const cognitiveAbility = useWatch({ control, name: 'cognitiveAbility' });
  const communicationAbility = useWatch({ control, name: 'communicationAbility' });

  // 이전 값 추적을 위한 ref
  const prevCognitiveAbility = useRef(cognitiveAbility);
  const prevCommunicationAbility = useRef(communicationAbility);

  // 값이 'good'으로 변경될 때만 초기화
  useEffect(() => {
    if (cognitiveAbility === 'good' && prevCognitiveAbility.current !== 'good') {
      setValue('cognitiveIssues', []);
    }
    prevCognitiveAbility.current = cognitiveAbility;
  }, [cognitiveAbility, setValue]);

  useEffect(() => {
    if (communicationAbility === 'good' && prevCommunicationAbility.current !== 'good') {
      setValue('communicationHelp', '');
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
          isChecked={!cognitiveFieldErrors.cognitiveAbility && !!cognitiveValues.cognitiveAbility}>
          <div onClick={() => cognitiveMarkFieldAsTouched('cognitiveAbility')}>
            <TwoOptionSelector
              name='cognitiveAbility'
              leftOption={{ label: '괜찮아요', value: 'good' }}
              rightOption={{ label: '도움이 필요해요', value: 'bad' }}
            />
          </div>
        </LabeledSection>
        {cognitiveValues.cognitiveAbility === 'bad' && (
          <LabeledSection
            label='구체적인 문제점'
            isChecked={
              !cognitiveFieldErrors.cognitiveIssues && !!cognitiveValues.cognitiveIssues?.length
            }>
            <div onClick={() => cognitiveMarkFieldAsTouched('cognitiveIssues')}>
              <MultiOptionSelector
                name='cognitiveIssues'
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
            !communicationFieldErrors.communicationAbility &&
            !!communicationValues.communicationAbility
          }>
          <div onClick={() => communicationMarkFieldAsTouched('communicationAbility')}>
            <TwoOptionSelector
              name='communicationAbility'
              leftOption={{ label: '괜찮아요', value: 'good' }}
              rightOption={{ label: '도움이 필요해요', value: 'bad' }}
            />
          </div>
        </LabeledSection>
        {communicationValues.communicationAbility === 'bad' && (
          <LabeledSection
            label='의사소통 도움'
            isChecked={
              !communicationFieldErrors.communicationHelp && !!communicationValues.communicationHelp
            }
            message={communicationFieldErrors.communicationHelp}>
            <FormInput
              type='text'
              size='M'
              placeholder='필요하신 도움을 작성해주세요'
              name='communicationHelp'
              validation={() => communicationMarkFieldAsTouched('communicationHelp')}
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
