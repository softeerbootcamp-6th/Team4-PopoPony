import { useNavigate } from '@tanstack/react-router';

import { memo, useEffect } from 'react';

import { useFormContext } from 'react-hook-form';

import { useFormValidation } from '@shared/hooks';
import type { FunnelStepProps } from '@shared/types';
import { Checkbox, Dot } from '@shared/ui';
import { FormInput, LabeledSection } from '@shared/ui/form';
import { FormLayout } from '@shared/ui/layout';

import { SearchButton } from '@customer/components';
import { routeFormSchema } from '@customer/types';

const EscortRoute = memo(({ handleNextStep }: FunnelStepProps) => {
  const { setValue } = useFormContext();
  const navigate = useNavigate();
  const { values, fieldErrors, isFormValid } = useFormValidation(routeFormSchema);

  useEffect(() => {
    if (values.meetingLocationDetail && values.returnLocationDetail) {
      const isSame =
        values.meetingLocationDetail.placeName === values.returnLocationDetail.placeName &&
        values.meetingLocationDetail.upperAddrName === values.returnLocationDetail.upperAddrName &&
        values.meetingLocationDetail.middleAddrName ===
          values.returnLocationDetail.middleAddrName &&
        values.meetingLocationDetail.lowerAddrName === values.returnLocationDetail.lowerAddrName &&
        values.meetingLocationDetail.firstAddrNo === values.returnLocationDetail.firstAddrNo &&
        values.meetingLocationDetail.secondAddrNo === values.returnLocationDetail.secondAddrNo &&
        values.meetingLocationDetail.roadName === values.returnLocationDetail.roadName &&
        values.meetingLocationDetail.firstBuildingNo ===
          values.returnLocationDetail.firstBuildingNo &&
        values.meetingLocationDetail.detailAddress === values.returnLocationDetail.detailAddress;

      if (isSame !== values.isMeetingLocationSameAsDestination) {
        setValue('isMeetingLocationSameAsDestination', isSame);
      }
    }
  }, [
    values.meetingLocationDetail,
    values.returnLocationDetail,
    values.isMeetingLocationSameAsDestination,
    setValue,
  ]);

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
  const handleCheckboxAble = () => {
    if (values.meetingLocationDetail) {
      return true;
    }
    return false;
  };
  const handleSameLocationChange = (checked: boolean) => {
    setValue('isMeetingLocationSameAsDestination', checked);
    if (!checked) {
      setValue('returnLocationDetail', {
        placeName: '',
        upperAddrName: '',
        middleAddrName: '',
        lowerAddrName: '',
        firstAddrNo: '',
        secondAddrNo: '',
        roadName: '',
        firstBuildingNo: '',
        secondBuildingNo: '',
        detailAddress: '',
        longitude: 0,
        latitude: 0,
      });
    }

    if (checked && values.meetingLocationDetail) {
      // meetingLocationDetail의 모든 정보를 returnLocationDetail에 복사
      const meetingData = values.meetingLocationDetail;
      setValue('returnLocationDetail', {
        placeName: meetingData.placeName,
        upperAddrName: meetingData.upperAddrName,
        middleAddrName: meetingData.middleAddrName,
        lowerAddrName: meetingData.lowerAddrName,
        firstAddrNo: meetingData.firstAddrNo,
        secondAddrNo: meetingData.secondAddrNo,
        roadName: meetingData.roadName,
        firstBuildingNo: meetingData.firstBuildingNo,
        secondBuildingNo: meetingData.secondBuildingNo,
        detailAddress: meetingData.detailAddress, // detailAddress도 복사
        longitude: meetingData.longitude,
        latitude: meetingData.latitude,
      });
    }
  };

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>동행 경로를 선택해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>
        <div className='relative'>
          <Dot active={!!values.meetingLocationDetail?.placeName} />
          <div className='ml-[2.8rem]'>
            <LabeledSection
              label='만남 장소'
              isChecked={
                !fieldErrors.meetingLocationDetail && !!values.meetingLocationDetail?.detailAddress
              }
              message={fieldErrors.meetingLocationDetail}>
              <div className='flex flex-col gap-[0.8rem]'>
                <SearchButton
                  onClick={() => handleNavigate('meeting')}
                  text={values.meetingLocationDetail?.placeName}
                />
                <FormInput
                  name='meetingLocationDetail.detailAddress'
                  type='text'
                  placeholder='만남 장소를 입력 ex) 현관 앞'
                />
              </div>
            </LabeledSection>
          </div>
          <div className='bg-stroke-neutral-dark absolute top-[1rem] left-[0.8rem] h-[calc(100%+2.2rem)] w-[0.4rem]' />
        </div>
        <div className='relative'>
          <Dot active={!!values.destinationDetail?.placeName} />
          <div className='ml-[2.8rem]'>
            <LabeledSection
              label='병원'
              isChecked={
                !fieldErrors.destinationDetail && !!values.destinationDetail?.detailAddress
              }
              message={fieldErrors.destinationDetail}>
              <div className='flex flex-col gap-[0.8rem]'>
                <SearchButton
                  onClick={() => handleNavigate('hospital')}
                  text={values.destinationDetail?.placeName}
                />
                <FormInput
                  name='destinationDetail.detailAddress'
                  type='text'
                  placeholder='방문하실 과 ex) 내과'
                />
              </div>
            </LabeledSection>
          </div>
          <div className='bg-stroke-neutral-dark absolute top-[1rem] left-[0.8rem] h-[calc(100%+2.2rem)] w-[0.4rem]' />
        </div>
        <div className='relative'>
          <Dot active={!!values.returnLocationDetail?.placeName} />
          <div className='ml-[2.8rem]'>
            <LabeledSection
              label='복귀 장소'
              isChecked={
                !fieldErrors.returnLocationDetail && !!values.returnLocationDetail?.detailAddress
              }
              message={fieldErrors.returnLocationDetail}>
              <div className='flex flex-col gap-[0.8rem]'>
                <SearchButton
                  onClick={() => handleNavigate('return')}
                  text={values.returnLocationDetail?.placeName}
                />
                <FormInput
                  name='returnLocationDetail.detailAddress'
                  type='text'
                  placeholder='복귀 장소를 입력 ex) 현관 앞'
                />
              </div>
            </LabeledSection>
          </div>
        </div>

        <div className='flex items-center gap-[0.4rem]'>
          <Checkbox
            label='만남 장소와 복귀 장소가 동일해요.'
            disabled={!handleCheckboxAble()}
            checked={values.isMeetingLocationSameAsDestination || false}
            onChange={() => handleSameLocationChange(!values.isMeetingLocationSameAsDestination)}
          />
        </div>
      </FormLayout.Content>
      <FormLayout.Footer>
        <FormLayout.FooterPrevNext handleClickNext={handleNextStep} disabled={!isFormValid} />
      </FormLayout.Footer>
    </FormLayout>
  );
});

export default EscortRoute;
