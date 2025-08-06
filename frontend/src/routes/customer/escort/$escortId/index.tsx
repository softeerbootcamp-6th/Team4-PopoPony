import {
  EscortCard,
  ProgressIndicator,
  StrengthTag,
  Tabs,
  Divider,
  Button,
  Modal,
} from '@components';
import {
  HelperCard,
  HelperEmptyCard,
  HelperSelectInfoCard,
  InfoSection,
  PaymentFailedCard,
  ReportInfoCard,
  RouteButton,
} from '@customer/components';
import { useModal } from '@hooks';
import { IcAlertCircle, IcCheck } from '@icons';
import { PageLayout } from '@layouts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <PageLayout>
      <PageLayout.Header title='내역 상세보기' showBack />
      <PageLayout.Content>
        <div className='bg-neutral-10 flex-col-start gap-[1.2rem] px-[2rem] py-[1.6rem]'>
          <EscortCard>
            <EscortCard.StatusHeader
              text='동행번호 NO.12394O4L'
              title='7월 22일 (토), 서울아산병원'
            />
            <EscortCard.Divider />
            <EscortCard.InfoSection>
              <EscortCard.Info type='time' text='7월 22일(토) 12시 ~ 15시' />
              <EscortCard.Info type='location' text='꿈에그린아파트 → 서울아산병원' />
            </EscortCard.InfoSection>
          </EscortCard>
          <ProgressIndicator currentStatus='매칭중' />
        </div>

        <Tabs defaultValue='신청 내역'>
          <Tabs.TabsList>
            <Tabs.TabsTrigger value='도우미'>도우미</Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='신청 내역'>신청 내역</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='도우미'>
            <Tabs.TabsCotentSection>
              <HelperSelectInfoCard />
              <HelperEmptyCard />
              {/* 기본 헬퍼 (자격증 2개) */}
              <HelperCard
                helper={{
                  id: '1',
                  name: '최솔희',
                  age: 39,
                  gender: '여',
                  profileImage: '/images/default-profile.svg',
                  certificates: ['간호사', '간호조무사'],
                  tags: ['support', 'wheelchair', 'care'],
                }}
                onClick={(id) => console.log('헬퍼 카드 클릭:', id)}
              />

              {/* 자격증 많은 헬퍼 (5개 - +3 표시) */}
              <HelperCard
                helper={{
                  id: '2',
                  name: '김민수',
                  age: 45,
                  gender: '남',
                  certificates: ['간호사', '간호조무사', '응급처치', '심폐소생술', '요양보호사'],
                  tags: ['support', 'wheelchair'],
                }}
                onClick={(id) => console.log('헬퍼 카드 클릭:', id)}
              />

              {/* 프로필 이미지 없는 헬퍼 */}
              <HelperCard
                helper={{
                  id: '3',
                  name: '박영희',
                  age: 52,
                  gender: '여',
                  certificates: ['요양보호사'],
                  tags: ['care'],
                }}
                onClick={(id) => console.log('헬퍼 카드 클릭:', id)}
              />
            </Tabs.TabsCotentSection>
            <Tabs.TabsDivider />
            <Tabs.TabsCotentSection>
              <ReportInfoCard />
              <PaymentFailedCard />
            </Tabs.TabsCotentSection>
            <Tabs.TabsDivider />
            <Tabs.TabsCotentSection gap='3.6rem'>
              <div>
                <h3 className='subtitle-18-bold text-text-neutral-primary'>동행 리포트</h3>
                <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
                  <InfoSection title='진행 시간'>
                    <div>
                      <span className='body1-16-medium text-text-neutral-primary'>
                        오후 12시 ~ 오후 3시 30분
                      </span>
                      <div className='flex-start gap-[0.4rem]'>
                        <IcAlertCircle
                          className='[&_path]:fill-icon-red-primary'
                          width={16}
                          height={16}
                        />
                        <span className='label3-12-medium text-red-50'>
                          예상 동행 시간보다 30분 초과되었어요!
                        </span>
                      </div>
                    </div>
                  </InfoSection>
                  <Divider />
                  <InfoSection title='다음 예약'>
                    <div>
                      <span className='body1-16-medium text-text-neutral-primary'>
                        2025년 7월 31일 오후 1시
                      </span>
                    </div>
                  </InfoSection>
                  <Divider />
                  <InfoSection title='전달 내용'>
                    <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary flex flex-col rounded-[0.6rem] p-[1rem]'>
                      <span>오늘 치료 잘 받으셨고, 약은 가방 안에 넣어드렸습니다.</span>
                    </div>
                  </InfoSection>
                </div>
              </div>
              <div>
                <h3 className='subtitle-18-bold text-text-neutral-primary'>총 이용 금액</h3>
                <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
                  <div className='flex-between'>
                    <span className='body2-14-medium text-text-neutral-secondary'>
                      기존 결제금액
                    </span>
                    <span className='body1-16-bold text-text-neutral-primary'>100,000원</span>
                  </div>
                  <Divider />
                  <div className='flex flex-col gap-[0.8rem]'>
                    <div className='flex-between'>
                      <span className='body2-14-medium text-text-neutral-secondary'>
                        추가 결제금액
                      </span>
                      <span className='body1-16-bold text-text-neutral-primary'>70,000원</span>
                    </div>
                    <div className='flex-between'>
                      <span className='body2-14-medium text-text-neutral-assistive'>택시 요금</span>
                      <span className='label3-12-medium text-text-neutral-secondary'>50,000원</span>
                    </div>
                    <div className='flex-between'>
                      <span className='body2-14-medium text-text-neutral-assistive'>
                        이용 시간 초과 요금
                      </span>
                      <span className='label3-12-medium text-text-neutral-secondary'>20,000원</span>
                    </div>
                    <div className='flex-start bg-background-light-red gap-[0.8rem] rounded-[0.6rem] p-[1rem]'>
                      <IcAlertCircle
                        className='[&_path]:fill-icon-red-primary'
                        width={16}
                        height={16}
                      />
                      <span className='caption1-12-medium text-text-red-primary'>
                        이용시간 초과요금은 15분에 5천원이에요.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.TabsCotentSection>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='신청 내역'>
            <Tabs.TabsCotentSection>
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
            </Tabs.TabsCotentSection>
            <Tabs.TabsDivider />
            <Tabs.TabsCotentSection gap='2.4rem'>
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
                    <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary flex flex-col rounded-[0.6rem] p-[1rem]'>
                      <div className='flex-start'>
                        <IcCheck />
                        <span>판단에 도움이 필요해요</span>
                      </div>
                      <div className='flex-start'>
                        <IcCheck />
                        <span>기억하거나 이해하는 것이 어려워요</span>
                      </div>
                    </div>
                  </InfoSection>
                  <InfoSection title='의사소통' status='도움이 필요해요'>
                    <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary rounded-[0.6rem] p-[1rem]'>
                      <span>이가 많이 없으셔서 발음하시는 게 불편하세요.</span>
                    </div>
                  </InfoSection>
                </div>
              </div>
              <Divider />
              <div className='flex flex-col gap-[1.6rem]'>
                <h3 className='subtitle-18-bold text-text-neutral-primary'>진료시 참고 사항</h3>
                <div className='flex flex-col gap-[2rem]'>
                  <InfoSection title='특이사항'>
                    <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary rounded-[0.6rem] p-[1rem]'>
                      <span>이가 많이 없으셔서 발음하시는 게 불편하세요.</span>
                    </div>
                  </InfoSection>
                  <InfoSection title='동행 목적'>
                    <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary rounded-[0.6rem] p-[1rem]'>
                      <span>이가 많이 없으셔서 발음하시는 게 불편하세요.</span>
                    </div>
                  </InfoSection>
                  <InfoSection title='요청사항'>
                    <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary rounded-[0.6rem] p-[1rem]'>
                      <span>다음 정기 검진 예약 꼭 잡아주세요!</span>
                    </div>
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
            </Tabs.TabsCotentSection>
          </Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
      <PageLayout.Footer>
        <div className='flex-start gap-[1.2rem]'>
          <Button onClick={() => {}}>도우미 후기 남기기</Button>
        </div>
      </PageLayout.Footer>
    </PageLayout>
  );
}
