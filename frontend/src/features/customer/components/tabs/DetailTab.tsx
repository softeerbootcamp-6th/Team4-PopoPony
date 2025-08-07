import { StrengthTag, Tabs, Divider, Button, Modal } from '@components';
import { InfoSection, RouteButton, GrayBox } from '@customer/components';
import { useModal } from '@hooks';
import { IcCheck } from '@icons';

const DetailTab = () => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      {/* 환자 및 동행 정보 */}
      <Tabs.TabsContentSection>
        <div className='flex-start gap-[1.2rem]'>
          <img
            src='/images/default-profile.svg'
            alt='환자 프로필'
            className='h-[5.6rem] w-[5.6rem] object-cover'
          />
          <div className='flex flex-col gap-[0.4rem]'>
            <span className='subtitle-18-bold text-text-neutral-primary'>김토닥 환자</span>
            <span className='label2-14-medium text-text-neutral-assistive'>
              ({`70`}세)/{`남`}
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-[0.8rem]'>
          <div className='flex-start body1-16-medium gap-[2rem]'>
            <span className='text-text-neutral-primary'>동행 날짜</span>
            <span className='text-text-neutral-secondary'>2025년 7월 22일 (토)</span>
          </div>
          <div className='flex-start body1-16-medium gap-[2rem]'>
            <span className='text-text-neutral-primary'>동행 시간</span>
            <span className='text-text-neutral-secondary'>오후 12시 ~ 3시 (3시간)</span>
          </div>
          <div className='flex-start body1-16-medium gap-[2rem]'>
            <span className='text-text-neutral-primary'>동행 병원</span>
            <div className='flex-start gap-[0.8rem]'>
              <span className='text-text-neutral-secondary'>서울아산병원</span>
              <button className='caption2-10-medium text-text-neutral-secondary border-stroke-neutral-dark w-fit rounded-[0.4rem] border px-[0.5rem] py-[0.2rem]'>
                지도 보기
              </button>
            </div>
          </div>
        </div>
        <RouteButton />
      </Tabs.TabsContentSection>
      <Tabs.TabsDivider />

      {/* 환자 상태 */}
      <Tabs.TabsContentSection gap='2.4rem'>
        <div className='flex flex-col gap-[1.6rem]'>
          <h3 className='subtitle-18-bold text-text-neutral-primary'>환자 상태</h3>
          <div className='flex flex-col gap-[2rem]'>
            <InfoSection title='보행 상태'>
              <div className='flex-start gap-[0.4rem]'>
                {['support', 'wheelchair'].map((tag) => (
                  <StrengthTag key={tag} type={tag as 'support' | 'wheelchair' | 'care'} />
                ))}
              </div>
            </InfoSection>
            <InfoSection title='인지 능력' status='괜찮아요'>
              <GrayBox>
                <div className='flex-start'>
                  <IcCheck />
                  <span>판단에 도움이 필요해요</span>
                </div>
                <div className='flex-start'>
                  <IcCheck />
                  <span>기억하거나 이해하는 것이 어려워요</span>
                </div>
              </GrayBox>
            </InfoSection>
            <InfoSection title='의사소통' status='도움이 필요해요'>
              <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary rounded-[0.6rem] p-[1rem]'>
                <span>이가 많이 없으셔서 발음하시는 게 불편하세요.</span>
              </div>
            </InfoSection>
          </div>
        </div>
        <Divider />

        {/* 진료시 참고 사항 */}
        <div className='flex flex-col gap-[1.6rem]'>
          <h3 className='subtitle-18-bold text-text-neutral-primary'>진료시 참고 사항</h3>
          <div className='flex flex-col gap-[2rem]'>
            <InfoSection title='동행 목적'>
              <GrayBox>
                <span>이가 많이 없으셔서 발음하시는 게 불편하세요.</span>
              </GrayBox>
            </InfoSection>
            <InfoSection title='요청사항'>
              <GrayBox>
                <span>다음 정기 검진 예약 꼭 잡아주세요!</span>
              </GrayBox>
            </InfoSection>
          </div>
        </div>
        <Button variant='assistive' onClick={openModal}>
          신청 취소하기
        </Button>
        <Modal isOpen={isOpen} onClose={closeModal}>
          <Modal.Title>동행 신청을 취소하시겠어요?</Modal.Title>
          <Modal.Content>취소된 동행은 복구할 수 없어요.</Modal.Content>
          <Modal.ButtonContainer>
            <Modal.ConfirmButton
              onClick={() => {
                alert('확인 버튼 클릭됨!');
                closeModal();
              }}>
              취소하기
            </Modal.ConfirmButton>
            <Modal.CloseButton onClick={closeModal}>돌아가기</Modal.CloseButton>
          </Modal.ButtonContainer>
        </Modal>
      </Tabs.TabsContentSection>
    </>
  );
};

export default DetailTab;
