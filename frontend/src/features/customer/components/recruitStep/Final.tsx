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
import { Button, TermsBottomSheet } from '@shared/ui';
import { FormLayout } from '@shared/ui/layout';
import { useNavigate } from '@tanstack/react-router';
import type { FunnelStepProps } from '@shared/types';
import { postRecruit } from '@customer/apis';
import { buildRecruitCreateRequest } from '@customer/utils';

const Final = ({ handleBackStep }: FunnelStepProps) => {
  const { getValues } = useFormContext<RecruitFormValues>();
  const formData = getValues();
  const navigate = useNavigate();
  const { mutate } = postRecruit();

  const handleSubmit = () => {
    const apiRequest = buildRecruitCreateRequest(formData);
    mutate(
      {
        body: apiRequest,
      },
      {
        onSuccess: () => {
          navigate({ to: '/customer/recruit/completed' });
        },
      }
    );
  };

  // 각 타입별로 데이터 분리
  const profileData: ProfileFormValues = {
    name: formData.name,
    gender: formData.gender,
    age: formData.age,
    phoneNumber: formData.phoneNumber,
    profileImageCreateRequest: formData.profileImageCreateRequest,
  };

  const conditionData: ConditionFormValues = {
    needsHelping: formData.needsHelping,
    usesWheelchair: formData.usesWheelchair,
  };

  const communicationData: CommunicationFormValues = {
    hasCognitiveIssue: formData.hasCognitiveIssue,
    cognitiveIssueDetail: formData.cognitiveIssueDetail,
    hasCommunicationIssue: formData.hasCommunicationIssue,
    communicationIssueDetail: formData.communicationIssueDetail,
  };

  const timeData: TimeFormValues = {
    escortDate: formData.escortDate,
    estimatedMeetingTime: formData.estimatedMeetingTime,
    estimatedReturnTime: formData.estimatedReturnTime,
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
        <FormLayout.Content className='bg-neutral-10'>
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
                        {profileData.name}
                      </h6>
                    </div>
                    <div className='flex w-[50%] gap-[0.8rem]'>
                      <h5 className='body2-14-bold text-text-neutral-primary'>나이</h5>
                      <h6 className='body2-14-medium text-text-neutral-primary'>
                        {profileData.age}세
                      </h6>
                    </div>
                  </div>
                  <div className='flex-between flex'>
                    <div className='flex w-[50%] gap-[0.8rem]'>
                      <h5 className='body2-14-bold text-text-neutral-primary'>성별</h5>
                      <h6 className='body2-14-medium text-text-neutral-primary'>
                        {profileData.gender}
                      </h6>
                    </div>
                    <div className='flex w-[50%] gap-[0.8rem]'>
                      <h5 className='body2-14-bold text-text-neutral-primary'>연락처</h5>
                      <h6 className='body2-14-medium text-text-neutral-primary'>
                        {profileData.phoneNumber}
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
                      {conditionData.needsHelping === 'true' ? '필요해요' : '필요 없어요'}
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
                      {communicationData.hasCognitiveIssue === 'false'
                        ? '괜찮아요'
                        : '도움이 필요해요'}
                    </h6>
                  </div>
                  <div className='flex items-center gap-[4.1rem]'>
                    <h5 className='body2-14-bold text-text-neutral-primary w-[5rem]'>의사소통</h5>
                    <h6 className='body2-14-medium text-text-neutral-primary'>
                      {communicationData.hasCommunicationIssue === 'false'
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
                      {timeData.estimatedMeetingTime} ~ {timeData.estimatedReturnTime}
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
            <FormLayout.FooterButtonWrapper>
              <div className='w-[10rem]'>
                <Button variant='secondary' onClick={handleBackStep}>
                  이전
                </Button>
              </div>
              <TermsBottomSheet onSubmit={handleSubmit}>
                <Button variant='primary' className='flex-1'>
                  다음
                </Button>
              </TermsBottomSheet>
            </FormLayout.FooterButtonWrapper>
          </div>
        </FormLayout.Footer>
      </FormLayout>
    </>
  );
};

export default Final;
