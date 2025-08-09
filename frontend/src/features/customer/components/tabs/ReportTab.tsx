import { Tabs, Divider } from '@components';
import { HelperCard, InfoSection, PaymentFailedCard, ReportInfoCard } from '@customer/components';
import { IcAlertCircle } from '@icons';

const ReportTab = () => {
  return (
    <>
      <Tabs.TabsContentSection>
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
          onClick={() => alert('준비중인 기능이에요')}
        />
      </Tabs.TabsContentSection>
      <Tabs.TabsDivider />
      <Tabs.TabsContentSection>
        <ReportInfoCard />
        <PaymentFailedCard />
      </Tabs.TabsContentSection>
      <Tabs.TabsDivider />
      <Tabs.TabsContentSection gap='gap-[3.6rem]'>
        {/* 동행 리포트 */}
        <div>
          <h3 className='subtitle-18-bold text-text-neutral-primary'>동행 리포트</h3>
          <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
            <InfoSection title='진행 시간'>
              <span className='body1-16-medium text-text-neutral-primary'>
                오후 12시 ~ 오후 3시 30분
              </span>
              <div className='flex-start gap-[0.4rem]'>
                <IcAlertCircle className='[&_path]:fill-icon-red-primary' width={16} height={16} />
                <span className='label3-12-medium text-red-50'>
                  예상 동행 시간보다 30분 초과되었어요!
                </span>
              </div>
            </InfoSection>
            <Divider />
            <InfoSection title='다음 예약'>
              <span className='body1-16-medium text-text-neutral-primary'>
                2025년 7월 31일 오후 1시
              </span>
            </InfoSection>
            <Divider />
            <InfoSection title='전달 내용'>
              <div className='bg-neutral-10 label2-14-medium text-text-neutral-primary flex flex-col rounded-[0.6rem] p-[1rem]'>
                <span>오늘 치료 잘 받으셨고, 약은 가방 안에 넣어드렸습니다.</span>
              </div>
            </InfoSection>
          </div>
        </div>

        {/* 이용 금액 */}
        <div>
          <h3 className='subtitle-18-bold text-text-neutral-primary'>총 이용 금액</h3>
          <div className='mt-[1.2rem] flex flex-col gap-[2rem]'>
            <div className='flex-between'>
              <span className='body2-14-medium text-text-neutral-secondary'>기존 결제금액</span>
              <span className='body1-16-bold text-text-neutral-primary'>100,000원</span>
            </div>
            <Divider />
            <div className='flex flex-col gap-[0.8rem]'>
              <div className='flex-between'>
                <span className='body2-14-medium text-text-neutral-secondary'>추가 결제금액</span>
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
                <IcAlertCircle className='[&_path]:fill-icon-red-primary' width={16} height={16} />
                <span className='caption1-12-medium text-text-red-primary'>
                  이용시간 초과요금은 15분에 5천원이에요.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Tabs.TabsContentSection>
    </>
  );
};

export default ReportTab;
