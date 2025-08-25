import { IcCheck } from '@icons';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

import { StrengthTagList } from '@entities/helper/ui';

import { useModal } from '@shared/hooks';
import {
  dateFormat,
  formatImageUrl,
  timeDuration,
  timeFormatWithOptionalMinutes,
} from '@shared/lib';
import { Button, Divider, Modal, ShowMapButton, Tabs } from '@shared/ui';

import { deleteRecruit } from '@customer/apis';
import { GrayBox, InfoSection, RouteButton } from '@customer/components';
import type { RecruitDetailResponse } from '@customer/types';

const routeApi = getRouteApi('/customer/escort/$escortId/');

const DetailTab = ({ data }: { data: RecruitDetailResponse }) => {
  const navigate = useNavigate();
  const { mutate } = deleteRecruit();
  const { escortId } = routeApi.useParams();
  const {
    isOpen: isDeleteRecruitOpen,
    openModal: openDeleteRecruitModal,
    closeModal: closeDeleteRecruitModal,
  } = useModal();
  const {
    isOpen: isDeleteRecruitSuccessOpen,
    openModal: openDeleteRecruitSuccessModal,
    closeModal: closeDeleteRecruitSuccessModal,
  } = useModal();

  const handleDeleteRecruit = () => {
    mutate(
      {
        params: {
          path: { recruitId: Number(escortId) },
        },
      },
      {
        onSuccess: () => {
          openDeleteRecruitSuccessModal();
        },
      }
    );
  };

  return (
    <>
      {/* 환자 및 동행 정보 */}
      <Tabs.TabsContentSection>
        <div className='flex-start gap-[1.2rem]'>
          <img
            src={formatImageUrl(data.patient.imageUrl)}
            alt='환자 프로필'
            className='h-[5.6rem] w-[5.6rem] rounded-full object-cover'
          />
          <div className='flex flex-col gap-[0.4rem]'>
            <span className='subtitle-18-bold text-text-neutral-primary'>
              {data.patient.name} 환자
            </span>
            <span className='label2-14-medium text-text-neutral-assistive'>
              ({data.patient.age}세)/{data.patient.gender}
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-[0.8rem]'>
          <div className='flex-start body1-16-medium gap-[2rem]'>
            <span className='text-text-neutral-primary'>동행 날짜</span>
            <span className='text-text-neutral-secondary'>
              {dateFormat(data.escortDate, 'M월 d일 (eee)')}
            </span>
          </div>
          <div className='flex-start body1-16-medium gap-[2rem]'>
            <span className='text-text-neutral-primary'>동행 시간</span>
            <span className='text-text-neutral-secondary'>
              {timeFormatWithOptionalMinutes(data.estimatedMeetingTime)} ~{' '}
              {timeFormatWithOptionalMinutes(data.estimatedReturnTime)} (
              {timeDuration(data.estimatedMeetingTime, data.estimatedReturnTime)})
            </span>
          </div>
          <div className='flex-start body1-16-medium gap-[2rem]'>
            <span className='text-text-neutral-primary'>동행 병원</span>
            <div className='flex-start gap-[0.8rem]'>
              <ShowMapButton
                businessAddress={data.route.hospitalLocationInfo.placeName}
                pos={{
                  lat: data.route.hospitalLocationInfo.lat,
                  lng: data.route.hospitalLocationInfo.lon,
                }}
                fontSize='medium'
              />
            </div>
          </div>
        </div>
        <RouteButton
          LocationData={[
            data.route.meetingLocationInfo,
            data.route.hospitalLocationInfo,
            data.route.returnLocationInfo,
          ]}
        />
      </Tabs.TabsContentSection>
      <Tabs.TabsDivider />

      {/* 환자 상태 */}
      <Tabs.TabsContentSection gap='gap-[2.4rem]'>
        <div>
          <h3 className='subtitle-18-bold text-text-neutral-primary'>환자 상태</h3>
          <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
            <InfoSection title='보행 상태'>
              <StrengthTagList
                needsHelping={data.patient.needsHelping}
                usesWheelchair={data.patient.usesWheelchair}
                hasCognitiveIssue={data.patient.hasCognitiveIssue}
              />
            </InfoSection>
            <InfoSection
              title='인지 능력'
              status={data.patient.hasCognitiveIssue ? '도움이 필요해요' : '괜찮아요'}>
              {data.patient.hasCognitiveIssue && (
                <GrayBox>
                  {data.patient.cognitiveIssueDetail?.map((detail, index) => (
                    <div className='flex-start' key={detail + index}>
                      <IcCheck />
                      <span>{detail}</span>
                    </div>
                  ))}
                </GrayBox>
              )}
            </InfoSection>
            <InfoSection
              title='의사소통'
              status={data.patient.hasCommunicationIssue ? '도움이 필요해요' : '괜찮아요'}>
              {data.patient.hasCommunicationIssue && (
                <GrayBox>
                  <div className='flex-start'>{data.patient.communicationIssueDetail}</div>
                </GrayBox>
              )}
            </InfoSection>
          </div>
        </div>
        <Divider />

        {/* 진료시 참고 사항 */}
        <div>
          <h3 className='subtitle-18-bold text-text-neutral-primary'>진료시 참고 사항</h3>
          <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
            <InfoSection title='동행 목적'>
              <GrayBox>
                <span>{data.purpose}</span>
              </GrayBox>
            </InfoSection>
            {data.extraRequest && (
              <InfoSection title='요청사항'>
                <GrayBox>
                  <span>{data.extraRequest}</span>
                </GrayBox>
              </InfoSection>
            )}
          </div>
        </div>
        {data.status === '매칭중' && (
          <Button variant='assistive' onClick={openDeleteRecruitModal}>
            신청 취소하기
          </Button>
        )}
        <Modal isOpen={isDeleteRecruitOpen} onClose={closeDeleteRecruitModal}>
          <Modal.Title>동행 신청을 취소하시겠어요?</Modal.Title>
          <Modal.Content>취소된 동행은 복구할 수 없어요.</Modal.Content>
          <Modal.ButtonContainer>
            <Modal.ConfirmButton
              onClick={() => {
                handleDeleteRecruit();
                closeDeleteRecruitModal();
              }}>
              취소하기
            </Modal.ConfirmButton>
            <Modal.CloseButton onClick={closeDeleteRecruitModal}>돌아가기</Modal.CloseButton>
          </Modal.ButtonContainer>
        </Modal>
        <Modal isOpen={isDeleteRecruitSuccessOpen} onClose={closeDeleteRecruitSuccessModal}>
          <Modal.Title>동행 신청 취소가 완료되었습니다.</Modal.Title>
          <Modal.ButtonContainer>
            <Modal.ConfirmButton
              onClick={() => {
                navigate({ to: '/customer' });
                closeDeleteRecruitSuccessModal();
              }}>
              홈으로 가기
            </Modal.ConfirmButton>
          </Modal.ButtonContainer>
        </Modal>
      </Tabs.TabsContentSection>
    </>
  );
};

export default DetailTab;
