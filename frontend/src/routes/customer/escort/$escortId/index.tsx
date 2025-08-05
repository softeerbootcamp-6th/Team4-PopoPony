import { EscortCard, ProgressIndicator, Tabs } from '@components';
import {
  HelperCard,
  HelperEmptyCard,
  HelperSelectInfoCard,
  PaymentFailedCard,
  ReportInfoCard,
  RouteButton,
} from '@customer/components';
import { PageLayout } from '@layouts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/')({
  component: RouteComponent,
});

function RouteComponent() {
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
                  profileImage: '/images/helper-profile.svg',
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
          </Tabs.TabsContent>
          <Tabs.TabsContent value='신청 내역'>
            <Tabs.TabsCotentSection>
              <RouteButton />
            </Tabs.TabsCotentSection>
            <Tabs.TabsDivider />
          </Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
    </PageLayout>
  );
}
