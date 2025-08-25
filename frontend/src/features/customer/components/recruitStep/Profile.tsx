import { memo, useEffect, useState } from 'react';

import { useFormContext } from 'react-hook-form';

import { useFormValidation } from '@shared/hooks';
import { booleanToString, formatImageUrl, formatPhoneNumber, numberToString } from '@shared/lib';
import type { FunnelStepProps } from '@shared/types';
import { BottomSheet, Button } from '@shared/ui';
import { FormInput, LabeledSection, PhotoUpload, TwoOptionSelector } from '@shared/ui/form';
import { FormLayout } from '@shared/ui/layout';

import { getPastPatientInfo, getPastPatientInfoDetail } from '@customer/apis';
import { profileSchema } from '@customer/types';

import { IcRadioOff, IcRadioOn } from '@assets/icons';

const Profile = memo(({ handleNextStep }: FunnelStepProps) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isPatientIdConfirmed, setIsPatientIdConfirmed] = useState(false);
  const { values, fieldErrors, isFormValid, markFieldAsTouched } = useFormValidation(profileSchema);
  const { data } = getPastPatientInfo();
  const { data: detailData } = getPastPatientInfoDetail(
    selectedPatientId as number,
    isPatientIdConfirmed
  );
  const pastPatientInfo = data?.data?.beforeList || [];

  const { reset } = useFormContext();

  const onSelectPatient = () => {
    setIsPatientIdConfirmed(true);
  };

  // 데이터가 도착했을 때에만 폼에 세팅하고 로그 출력
  useEffect(() => {
    if (!isPatientIdConfirmed || !selectedPatientId) return;
    if (!detailData) return;
    const { patientDetail, meetingLocationDetail, destinationDetail, returnLocationDetail } =
      detailData?.data || {};
    reset({
      name: patientDetail?.name,
      age: numberToString(patientDetail?.age),
      gender: patientDetail?.gender,
      profileImageCreateRequest: {
        s3Key: patientDetail?.s3Key,
        contentType: patientDetail?.contentType,
        size: patientDetail?.size,
        checksum: patientDetail?.checksum,
      },
      imageUrl: formatImageUrl(patientDetail?.imageUrl),
      phoneNumber: formatPhoneNumber(patientDetail?.phoneNumber),
      needsHelping: booleanToString(patientDetail?.needsHelping),
      usesWheelchair: booleanToString(patientDetail?.usesWheelchair),
      hasCognitiveIssue: booleanToString(patientDetail?.hasCognitiveIssue),
      cognitiveIssueDetail: patientDetail?.cognitiveIssueDetail,
      hasCommunicationIssue: booleanToString(patientDetail?.hasCommunicationIssue),
      communicationIssueDetail: patientDetail?.communicationIssueDetail,
      meetingLocationDetail,
      destinationDetail,
      returnLocationDetail,
    });
    setIsBottomSheetOpen(false);
  }, [detailData, isPatientIdConfirmed, selectedPatientId, reset]);

  return (
    <FormLayout>
      <FormLayout.Content>
        <FormLayout.TitleWrapper>
          <FormLayout.Title>동행할 환자의 기본정보를 입력해주세요</FormLayout.Title>
        </FormLayout.TitleWrapper>
        {pastPatientInfo.length > 0 && (
          <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
            <BottomSheet.Trigger asChild>
              <Button size='lg' variant='assistive'>
                이전 환자 정보 불러오기
              </Button>
            </BottomSheet.Trigger>
            <BottomSheet.Content>
              <BottomSheet.Header>
                <BottomSheet.Title>이전 환자 정보</BottomSheet.Title>
              </BottomSheet.Header>
              <div className='flex flex-col'>
                {pastPatientInfo.map((patient) => (
                  <div
                    className='flex-between border-stroke-neutral-dark mx-[2rem] border-b py-[1.2rem]'
                    key={patient.recruitId}>
                    <input
                      type='radio'
                      id={String(patient.recruitId)}
                      value={patient.recruitId}
                      className='peer hidden'
                      checked={selectedPatientId === patient.recruitId}
                    />
                    <label
                      htmlFor={String(patient.recruitId)}
                      onClick={() => setSelectedPatientId(patient.recruitId)}
                      className='flex items-center gap-[0.8rem]'>
                      {selectedPatientId === patient.recruitId ? <IcRadioOn /> : <IcRadioOff />}
                      <p className='body1-16-bold text-text-neutral-primary'>{patient.name}</p>
                      <p className='body2-14-medium text-text-neutral-secondary'>
                        {patient.destination}
                      </p>
                    </label>
                    <p className='label2-14-medium text-neutral-assitive'>{patient.escortDate}</p>
                  </div>
                ))}
              </div>
              <BottomSheet.Footer>
                <Button
                  variant='primary'
                  onClick={onSelectPatient}
                  className='w-full'
                  disabled={!selectedPatientId}>
                  선택하기
                </Button>
              </BottomSheet.Footer>
            </BottomSheet.Content>
          </BottomSheet>
        )}

        <LabeledSection
          label='프로필 이미지'
          isChecked={!fieldErrors.profileImageCreateRequest && !!values.profileImageCreateRequest}
          message={fieldErrors.profileImageCreateRequest}>
          <div className='flex-center w-full'>
            <PhotoUpload
              name='profileImageCreateRequest'
              prefix='uploads/patient'
              placeholder='환자 사진'
            />
          </div>
        </LabeledSection>

        <div className='flex gap-[1.2rem]'>
          <LabeledSection
            label='환자 이름'
            isChecked={!fieldErrors.name && !!values.name}
            message={fieldErrors.name}>
            <FormInput
              type='text'
              size='M'
              placeholder='이름 입력'
              name='name'
              validation={() => markFieldAsTouched('name')}
            />
          </LabeledSection>

          <LabeledSection
            label='환자 나이'
            isChecked={!fieldErrors.age && !!values.age}
            message={fieldErrors.age}>
            <FormInput
              type='number'
              size='M'
              placeholder='나이 입력'
              description='세'
              name='age'
              validation={() => markFieldAsTouched('age')}
            />
          </LabeledSection>
        </div>

        <LabeledSection label='환자 성별' isChecked={!fieldErrors.gender && !!values.gender}>
          <div onClick={() => markFieldAsTouched('gender')}>
            <TwoOptionSelector
              name='gender'
              leftOption={{ label: '남자', value: '남자' }}
              rightOption={{ label: '여자', value: '여자' }}
            />
          </div>
        </LabeledSection>

        <LabeledSection
          label='환자 연락처'
          isChecked={!fieldErrors.phoneNumber && !!values.phoneNumber}
          message={fieldErrors.phoneNumber}>
          <FormInput
            type='contact'
            size='M'
            placeholder='연락처 입력'
            name='phoneNumber'
            validation={() => markFieldAsTouched('phoneNumber')}
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

export default Profile;
