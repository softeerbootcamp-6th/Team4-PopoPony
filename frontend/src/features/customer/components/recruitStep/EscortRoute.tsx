import React from 'react';
import type { RecruitStepProps } from '@customer/types';
import { useNavigate } from '@tanstack/react-router';
import { FormLayout } from '@layouts';
import { useWatch } from 'react-hook-form';
import { FormInput, LabeledSection, Button } from '@components';
import { z } from 'zod';
import { useFormValidation } from '@customer/hooks';

const locationDetailSchema = z.object({
  placeName: z.string(),
  upperAddrName: z.string(),
  middleAddrName: z.string(),
  lowerAddrName: z.string(),
  firstAddrNo: z.string(),
  secondAddrNo: z.string(),
  roadName: z.string(),
  firstBuildingNo: z.string(),
  secondBuildingNo: z.string().optional(),
  detailAddress: z.string().min(1, { message: '필수 입력 항목입니다.' }),
  longitude: z.number(),
  latitude: z.number(),
});

const routeFormSchema = z.object({
  meetingLocationDetail: locationDetailSchema,
  destinationDetail: locationDetailSchema,
  returnLocationDetail: locationDetailSchema,
});

const EscortRoute = ({ handleNextStep }: RecruitStepProps) => {
  const navigate = useNavigate();
  const { values, fieldErrors, isFormValid, markFieldAsTouched } =
    useFormValidation(routeFormSchema);

  const handleNavigate = (place: string) => {
    navigate({
      to: '/customer/recruit/$step',
      params: {
        step: 'searchRoute',
      },
      search: {
        place: place as 'meeting' | 'hospital' | 'return',
      },
    });
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>동행 경로를 선택해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>
        <Button onClick={() => handleNavigate('meeting')}>
          {values.meetingLocationDetail?.placeName || '지번, 도로명, 건물명으로 검색'}
        </Button>
        <LabeledSection
          label='만남 장소'
          isChecked={
            !fieldErrors.meetingLocationDetail && !!values.meetingLocationDetail?.detailAddress
          }
          message={fieldErrors.meetingLocationDetail}>
          <FormInput
            name='meetingLocationDetail.detailAddress'
            type='text'
            placeholder='만남 장소를 입력 ex) 현관 앞'
          />
        </LabeledSection>
        <Button onClick={() => handleNavigate('hospital')}>
          {values.destinationDetail?.placeName || '병원명으로 검색'}
        </Button>
        <LabeledSection
          label='병원'
          isChecked={!fieldErrors.destinationDetail && !!values.destinationDetail?.detailAddress}
          message={fieldErrors.destinationDetail}>
          <FormInput
            name='destinationDetail.detailAddress'
            type='text'
            placeholder='방문하실 과 ex) 내과'
          />
        </LabeledSection>
        <Button onClick={() => handleNavigate('return')}>
          {values.returnLocationDetail?.placeName || '지번, 도로명, 건물명으로 검색'}
        </Button>
        <LabeledSection
          label='복귀 장소'
          isChecked={
            !fieldErrors.returnLocationDetail && !!values.returnLocationDetail?.detailAddress
          }
          message={fieldErrors.returnLocationDetail}>
          <FormInput
            name='returnLocationDetail.detailAddress'
            type='text'
            placeholder='복귀 장소를 입력 ex) 현관 앞'
          />
        </LabeledSection>
      </FormLayout.Content>
      <FormLayout.Footer>
        <Button disabled={!isFormValid} onClick={handleNextStep}>
          다음
        </Button>
      </FormLayout.Footer>
    </FormLayout>
  );
};

export default EscortRoute;
