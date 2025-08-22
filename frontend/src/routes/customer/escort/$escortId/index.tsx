import { useState } from 'react';
import {
  EscortCard,
  ProgressIndicator,
  Tabs,
  Button,
  FallbackUI,
  PageLayoutFallbackUI,
} from '@components';
import { DetailTab, HelperTab, ReportTab } from '@customer/components';
import { PageLayout } from '@layouts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { RecruitDetailResponse } from '@customer/types';
import { getRecruitById } from '@customer/apis';
import { dateFormat, timeFormat } from '@utils';
import { ErrorBoundary } from 'react-error-boundary';
import { $api } from '@apis';
import { useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/customer/escort/$escortId/')({
  errorComponent: ({ error, reset }) => (
    <PageLayoutFallbackUI
      error={error instanceof Error ? error : new Error(String(error))}
      resetErrorBoundary={reset}
    />
  ),
  component: RouteComponent,
});

const refineCardData = (recruitData: RecruitDetailResponse) => {
  const statusText = '동행번호 NO.' + recruitData.recruitId;
  const cardTitle =
    dateFormat(recruitData.escortDate, 'M월 d일 (eee)') +
    ', ' +
    recruitData.route.hospitalLocationInfo.placeName;
  const cardTimeText = `${dateFormat(recruitData.escortDate, 'M월 d일(eee)')} ${timeFormat(recruitData.estimatedMeetingTime)} ~ ${timeFormat(recruitData.estimatedReturnTime)}`;
  const cardLocationText = `${recruitData.route.meetingLocationInfo.placeName} → ${recruitData.route.hospitalLocationInfo.placeName}`;
  return { statusText, cardTitle, cardTimeText, cardLocationText };
};

function RouteComponent() {
  // 쿼리 클라이언트 초기화
  const qc = useQueryClient();
  const helperListOpts = $api.queryOptions('get', '/api/recruits/helper');

  const navigate = useNavigate();
  const [hasReview, setHasReview] = useState(false);
  const [helperId, setHelperId] = useState<number | null>(null);
  const { escortId } = Route.useParams();

  const { data: recruitData, isLoading } = getRecruitById(Number(escortId));

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!recruitData || !recruitData.data) {
    return null;
  }
  const { statusText, cardTitle, cardTimeText, cardLocationText } = refineCardData(
    recruitData.data
  );
  const handleReviewClick = () => {
    navigate({
      to: '/customer/escort/$escortId/$helperId/review/$step',
      params: { escortId: escortId, helperId: helperId?.toString() || '', step: 'summary' },
    });
  };

  return (
    <PageLayout>
      <PageLayout.Header title='내역 상세보기' showBack />
      <PageLayout.Content>
        <div className='bg-neutral-10 flex-col-start gap-[1.2rem] px-[2rem] py-[1.6rem]'>
          <EscortCard>
            <EscortCard.StatusHeader text={statusText} title={cardTitle} hasOnClickEvent={false} />
            <EscortCard.Divider />
            <EscortCard.InfoSection>
              <EscortCard.Info type='time' text={cardTimeText} />
              <EscortCard.Info type='location' text={cardLocationText} />
            </EscortCard.InfoSection>
          </EscortCard>
          <ProgressIndicator currentStatus={recruitData.data.status} />
        </div>

        <Tabs defaultValue={recruitData.data.status === '동행완료' ? '리포트' : '도우미'}>
          <Tabs.TabsList>
            {recruitData.data.status !== '동행완료' ? (
              <Tabs.TabsTrigger value='도우미'>도우미</Tabs.TabsTrigger>
            ) : (
              <Tabs.TabsTrigger value='리포트'>리포트</Tabs.TabsTrigger>
            )}
            <Tabs.TabsTrigger value='신청 내역'>신청 내역</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='도우미'>
            <ErrorBoundary
              fallbackRender={({ error, resetErrorBoundary }) => (
                <FallbackUI error={error} resetErrorBoundary={resetErrorBoundary} />
              )}
              onReset={() => {
                qc.invalidateQueries(helperListOpts);
              }}>
              <HelperTab status={recruitData.data.status} />
            </ErrorBoundary>
          </Tabs.TabsContent>
          <Tabs.TabsContent value='리포트'>
            <ReportTab setHasReview={setHasReview} setHelperId={setHelperId} />
          </Tabs.TabsContent>
          <Tabs.TabsContent value='신청 내역'>
            <DetailTab data={recruitData.data} />
          </Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
      {recruitData.data.status === '동행완료' && !hasReview && (
        <PageLayout.Footer>
          <Button onClick={handleReviewClick}>도우미 후기 남기기</Button>
        </PageLayout.Footer>
      )}
    </PageLayout>
  );
}
