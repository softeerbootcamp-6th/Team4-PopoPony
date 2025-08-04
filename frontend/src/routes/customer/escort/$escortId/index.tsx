import { EscortCard, Tabs } from '@components';
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
        <div className='bg-neutral-10 px-[2rem] py-[1.6rem]'>
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
        </div>

        <Tabs defaultValue='도우미'>
          <Tabs.TabsList>
            <Tabs.TabsTrigger value='도우미'>도우미</Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='신청 내역'>신청 내역</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='도우미'>
            <div className='flex-col-start gap-[1.2rem] p-[2rem]'></div>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='신청 내역'>Change your 신청 내역 here.</Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
    </PageLayout>
  );
}
