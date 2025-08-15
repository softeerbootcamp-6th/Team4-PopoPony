import { EscortCard, ProgressIndicator, Tabs, Button } from '@components';
import { DetailTab, HelperTab, ReportTab } from '@customer/components';
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
              hasOnClickEvent={false}
            />
            <EscortCard.Divider />
            <EscortCard.InfoSection>
              <EscortCard.Info type='time' text='7월 22일(토) 12시 ~ 15시' />
              <EscortCard.Info type='location' text='꿈에그린아파트 → 서울아산병원' />
            </EscortCard.InfoSection>
          </EscortCard>
          <ProgressIndicator currentStatus='매칭중' />
        </div>

        <Tabs defaultValue='도우미'>
          <Tabs.TabsList>
            <Tabs.TabsTrigger value='도우미'>도우미</Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='리포트'>리포트</Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='신청 내역'>신청 내역</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='도우미'>
            <HelperTab />
          </Tabs.TabsContent>
          <Tabs.TabsContent value='리포트'>
            <ReportTab />
          </Tabs.TabsContent>
          <Tabs.TabsContent value='신청 내역'>
            <DetailTab />
          </Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
      <PageLayout.Footer>
        <Button onClick={() => alert('준비중인 기능이에요')}>도우미 후기 남기기</Button>
      </PageLayout.Footer>
    </PageLayout>
  );
}
