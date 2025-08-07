import { useFormContext } from 'react-hook-form';
import type {
  RecruitFormValues,
  ProfileFormValues,
  ConditionFormValues,
  CommunicationFormValues,
  TimeFormValues,
  RouteFormValues,
} from '@customer/types';
import { CardWrapper } from '@customer/components';
import { Button, BottomSheet, CheckboxCircle, TermsModal } from '@components';
import { FormLayout } from '@layouts';
import { IcChevronRight } from '@icons';
import { useState } from 'react';
import { getTermsById } from '@constants';
import type { TermsData } from '@types';
import { useNavigate } from '@tanstack/react-router';
import type { RecruitStepProps } from '@customer/types';

export function Final({ handleBackStep }: RecruitStepProps) {
  const { getValues } = useFormContext<RecruitFormValues>();
  const formData = getValues();
  const navigate = useNavigate();

  // 약관 모달 상태
  const [selectedTerms, setSelectedTerms] = useState<TermsData | null>(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // BottomSheet 상태
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // 약관 동의 상태
  const [termsAgreement, setTermsAgreement] = useState({
    serviceTerms: false,
    privacyPolicy: false,
    locationTerms: false,
  });

  // 모든 약관이 동의되었는지 확인
  const isAllChecked =
    termsAgreement.serviceTerms && termsAgreement.privacyPolicy && termsAgreement.locationTerms;

  const handleTermsClick = (termsId: string) => {
    const terms = getTermsById(termsId);
    // BottomSheet 닫기
    setIsBottomSheetOpen(false);
    if (terms) {
      setSelectedTerms(terms);
      setIsTermsModalOpen(true);
    }
  };

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
    setSelectedTerms(null);
    setIsBottomSheetOpen(true);
  };

  const handleTermsAgreementChange = (termsId: string, checked: boolean) => {
    setTermsAgreement((prev) => ({
      ...prev,
      [termsId]: checked,
    }));
  };

  const handleSubmit = async () => {
    try {
      // // API 호출하여 데이터 제출
      // console.log('Submitting data:', formData);
      // // await submitRecruitRequest(formData);

      // 성공 시 완료 페이지로 이동
      alert('동행 신청이 완료되었습니다!');
      navigate({ to: '/customer/recruit/completed' });
    } catch (error) {
      console.error('제출 실패:', error);
    }
  };

  // 각 타입별로 데이터 분리
  const profileData: ProfileFormValues = {
    patientName: formData.patientName,
    patientSex: formData.patientSex,
    patientAge: formData.patientAge,
    patientContact: formData.patientContact,
    profileImageUrl: formData.profileImageUrl,
  };

  const conditionData: ConditionFormValues = {
    needsPhysicalSupport: formData.needsPhysicalSupport,
    usesWheelchair: formData.usesWheelchair,
  };

  const communicationData: CommunicationFormValues = {
    cognitiveAbility: formData.cognitiveAbility,
    cognitiveIssues: formData.cognitiveIssues,
    communicationAbility: formData.communicationAbility,
    communicationHelp: formData.communicationHelp,
  };

  const timeData: TimeFormValues = {
    escortDate: formData.escortDate,
    escortStartTime: formData.escortStartTime,
    escortEndTime: formData.escortEndTime,
    escortDuration: formData.escortDuration,
  };

  const routeData: RouteFormValues = {
    meetingLocationDetail: formData.meetingLocationDetail,
    destinationDetail: formData.destinationDetail,
    returnLocationDetail: formData.returnLocationDetail,
    isMeetingLocationSameAsDestination: formData.isMeetingLocationSameAsDestination,
  };

  return (
    <>
      <FormLayout>
        <FormLayout.Content>
          <div className='flex flex-col gap-[2rem]'>
            <FormLayout.TitleWrapper>
              <FormLayout.Title>동행 신청 확인</FormLayout.Title>
              <FormLayout.SubTitle>입력하신 정보를 확인해주세요</FormLayout.SubTitle>
            </FormLayout.TitleWrapper>

            {/* 폼 데이터 표시 */}
            <div className='flex flex-col gap-[1.6rem]'>
              <CardWrapper>
                <CardWrapper.Title title='환자 개인 정보' />
                <div className='flex flex-col gap-[0.8rem]'>
                  <div className='flex-between flex'>
                    <div className='flex w-[50%] gap-[0.8rem]'>
                      <h5 className='body2-14-bold text-text-neutral-primary'>이름</h5>
                      <h6 className='body2-14-medium text-text-neutral-primary'>
                        {profileData.patientName}
                      </h6>
                    </div>
                    <div className='flex w-[50%] gap-[0.8rem]'>
                      <h5 className='body2-14-bold text-text-neutral-primary'>나이</h5>
                      <h6 className='body2-14-medium text-text-neutral-primary'>
                        {profileData.patientAge}세
                      </h6>
                    </div>
                  </div>
                  <div className='flex-between flex'>
                    <div className='flex w-[50%] gap-[0.8rem]'>
                      <h5 className='body2-14-bold text-text-neutral-primary'>성별</h5>
                      <h6 className='body2-14-medium text-text-neutral-primary'>
                        {profileData.patientSex === 'male' ? '남자' : '여자'}
                      </h6>
                    </div>
                    <div className='flex w-[50%] gap-[0.8rem]'>
                      <h5 className='body2-14-bold text-text-neutral-primary'>연락처</h5>
                      <h6 className='body2-14-medium text-text-neutral-primary'>
                        {profileData.patientContact}
                      </h6>
                    </div>
                  </div>
                </div>
              </CardWrapper>
              <CardWrapper>
                <CardWrapper.Title title='환자 상태 정보' />
                <div className='flex flex-col gap-[0.8rem]'>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>부축</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {conditionData.needsPhysicalSupport === 'true' ? '필요해요' : '필요 없어요'}
                    </h6>
                  </div>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>휠체어</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {conditionData.usesWheelchair === 'true' ? '이용해요' : '이용하지 않아요'}
                    </h6>
                  </div>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>인지능력</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {communicationData.cognitiveAbility === 'good'
                        ? '괜찮아요'
                        : '도움이 필요해요'}
                    </h6>
                  </div>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>의사소통</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {communicationData.communicationAbility === 'good'
                        ? '괜찮아요'
                        : '도움이 필요해요'}
                    </h6>
                  </div>
                </div>
              </CardWrapper>

              <CardWrapper>
                <CardWrapper.Title title='동행 정보' />
                <div className='flex flex-col gap-[1.2rem]'>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>동행일</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {timeData.escortDate}
                    </h6>
                  </div>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>동행시간</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {timeData.escortStartTime} ~ {timeData.escortEndTime}
                    </h6>
                  </div>
                </div>
              </CardWrapper>

              <CardWrapper>
                <CardWrapper.Title title='동행 경로' />
                <div className='flex flex-col gap-[1.2rem]'>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>만남</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {routeData.meetingLocationDetail?.placeName}{' '}
                      {routeData.meetingLocationDetail?.detailAddress}
                    </h6>
                  </div>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>병원</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {routeData.destinationDetail?.placeName}{' '}
                      {routeData.destinationDetail?.detailAddress}
                    </h6>
                  </div>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>복귀</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {routeData.returnLocationDetail?.placeName}{' '}
                      {routeData.returnLocationDetail?.detailAddress}
                    </h6>
                  </div>
                </div>
              </CardWrapper>
            </div>
          </div>
        </FormLayout.Content>
        <FormLayout.Footer>
          <div className='flex gap-[1.2rem]'>
            <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
              <FormLayout.FooterButtonWrapper>
                <div className='w-[10rem]'>
                  <Button variant='secondary' onClick={handleBackStep}>
                    이전
                  </Button>
                </div>
                <BottomSheet.Trigger asChild>
                  <Button variant='primary' className='flex-1'>
                    다음
                  </Button>
                </BottomSheet.Trigger>
              </FormLayout.FooterButtonWrapper>
              <BottomSheet.Content>
                <BottomSheet.Header>
                  <BottomSheet.Title>이용 약관 동의가 필요해요!</BottomSheet.Title>
                  <BottomSheet.Description>
                    <div className='flex flex-col gap-[1.5rem]'>
                      <div className='flex items-center gap-[0.8rem]'>
                        <CheckboxCircle
                          checked={termsAgreement.serviceTerms}
                          onChange={(e) =>
                            handleTermsAgreementChange('serviceTerms', e.target.checked)
                          }
                        />
                        <button
                          className='flex items-center gap-[0.4rem]'
                          onClick={() => handleTermsClick('service-terms')}>
                          <p className='body1-16-medium text-text-neutral-primary'>
                            토닥 서비스 이용약관(필수)
                          </p>
                          <IcChevronRight className='[&_path]:stroke-icon-neutral-secondary [&_path]:fill-icon-neutral-secondary h-[2.4rem] w-[2.4rem]' />
                        </button>
                      </div>
                      <div className='flex items-center gap-[0.8rem]'>
                        <CheckboxCircle
                          checked={termsAgreement.privacyPolicy}
                          onChange={(e) =>
                            handleTermsAgreementChange('privacyPolicy', e.target.checked)
                          }
                        />
                        <button
                          className='flex items-center gap-[0.4rem]'
                          onClick={() => handleTermsClick('privacy-policy')}>
                          <p className='body1-16-medium text-text-neutral-primary'>
                            개인정보처리방침(필수)
                          </p>
                          <IcChevronRight className='[&_path]:stroke-icon-neutral-secondary [&_path]:fill-icon-neutral-secondary h-[2.4rem] w-[2.4rem]' />
                        </button>
                      </div>
                      <div className='flex items-center gap-[0.8rem]'>
                        <CheckboxCircle
                          checked={termsAgreement.locationTerms}
                          onChange={(e) =>
                            handleTermsAgreementChange('locationTerms', e.target.checked)
                          }
                        />
                        <button
                          className='flex items-center gap-[0.4rem]'
                          onClick={() => handleTermsClick('location-terms')}>
                          <p className='body1-16-medium text-text-neutral-primary'>
                            위치정보 이용약관(필수)
                          </p>
                          <IcChevronRight className='[&_path]:stroke-icon-neutral-secondary [&_path]:fill-icon-neutral-secondary h-[2.4rem] w-[2.4rem]' />
                        </button>
                      </div>
                    </div>
                  </BottomSheet.Description>
                </BottomSheet.Header>

                <BottomSheet.Footer>
                  <Button
                    variant='primary'
                    onClick={handleSubmit}
                    className='w-full'
                    disabled={!isAllChecked}>
                    동의하고 신청하기
                  </Button>
                </BottomSheet.Footer>
              </BottomSheet.Content>
            </BottomSheet>
          </div>
        </FormLayout.Footer>
      </FormLayout>

      {/* 약관 모달 */}
      {selectedTerms && (
        <TermsModal
          isOpen={isTermsModalOpen}
          onClose={handleCloseTermsModal}
          terms={selectedTerms}
        />
      )}
    </>
  );
}
