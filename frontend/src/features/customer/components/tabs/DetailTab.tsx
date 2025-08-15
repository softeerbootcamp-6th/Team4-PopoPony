import { StrengthTag, Tabs, Divider, Button, Modal } from '@components';
import { InfoSection, RouteButton, GrayBox } from '@customer/components';
import { useModal } from '@hooks';
import { IcCheck } from '@icons';
import type { EscortStrength } from '@types';
import type { RecruitDetailResponse } from '@customer/types';
import { dateFormat, timeFormatWithOptionalMinutes, timeDuration } from '@utils';
import { useNavigate, useParams } from '@tanstack/react-router';
import { deleteRecruit } from '@customer/apis';

const DetailTab = ({ data }: { data: RecruitDetailResponse }) => {
  const navigate = useNavigate();
  const { mutate } = deleteRecruit();
  const { escortId } = useParams({ from: '/customer/escort/$escortId/' });
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
  const taglist = [];
  if (data.patient.needsHelping) {
    taglist.push('안전한 부축');
  }
  if (data.patient.usesWheelchair) {
    taglist.push('휠체어 이동');
  }

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
        onError: () => {
          alert('동행 신청 취소에 실패했습니다.');
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
            src={import.meta.env.VITE_API_BASE_URL + data.patient.imageUrl}
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
              <span className='text-text-neutral-secondary'>
                {data.route.hospitalLocationInfo.placeName}
              </span>
              {/* 이 지도보기 버튼의 onclick은 무엇을 해줘야 할까요 */}
              <button className='caption2-10-medium text-text-neutral-secondary border-stroke-neutral-dark w-fit rounded-[0.4rem] border px-[0.5rem] py-[0.2rem]'>
                지도 보기
              </button>
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
              <div className='flex-start gap-[0.4rem]'>
                {taglist.map((tag) => (
                  <StrengthTag key={tag} type={tag as EscortStrength} />
                ))}
              </div>
            </InfoSection>
            <InfoSection
              title='인지 능력'
              status={data.patient.hasCognitiveIssue ? '도움이 필요해요' : '괜찮아요'}>
              {data.patient.hasCognitiveIssue && (
                <GrayBox>
                  {data.patient.cognitiveIssueDetail?.map((detail) => (
                    <div className='flex-start'>
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
        {/* TODO:도우미 후기가 있으면 버튼 안 뜨기 */}
        {data.status !== '동행완료' && (
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
