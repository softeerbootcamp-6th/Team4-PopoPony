import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useState } from 'react';

import { RecruitCard } from '@widgets/ui';

import { ProgressIndicator } from '@entities/recruit/ui';

import { dateFormat, timeFormat } from '@shared/lib';
import { Button, ErrorSuspenseBoundary, SuspenseUI, Tabs } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';

import { getRecruitById } from '@customer/apis';
import { DetailTab, HelperTab, ReportTab } from '@customer/components';
import type { RecruitDetailResponse } from '@customer/types';

export const Route = createFileRoute('/customer/escort/$escortId/')({
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
  const navigate = useNavigate();
  const [hasReview, setHasReview] = useState(false);
  const [helperId, setHelperId] = useState<number | null>(null);
  const { escortId } = Route.useParams();

  const { data: recruitData, isLoading } = getRecruitById(Number(escortId));

  if (isLoading) {
    return <SuspenseUI />;
  }
  if (!recruitData || !recruitData.data) {
    return null;
  }
  const { statusText, cardTitle, cardTimeText, cardLocationText } = refineCardData(
    recruitData?.data || {}
  );
  const handleReviewClick = () => {
    navigate({
      to: '/customer/escort/$escortId/$helperId/review/$step',
      params: { escortId: escortId, helperId: helperId?.toString() || '', step: 'summary' },
    });
  };

  return (
    <>
      <PageLayout.Header title='내역 상세보기' showBack />
      <PageLayout.Content>
        <div className='bg-neutral-10 flex-col-start gap-[1.2rem] px-[2rem] py-[1.6rem]'>
          <RecruitCard>
            <RecruitCard.StatusHeader text={statusText} title={cardTitle} hasOnClickEvent={false} />
            <RecruitCard.Divider />
            <RecruitCard.InfoSection>
              <RecruitCard.Info type='time' text={cardTimeText} />
              <RecruitCard.Info type='location' text={cardLocationText} />
            </RecruitCard.InfoSection>
          </RecruitCard>
          <ProgressIndicator currentStatus={recruitData.data.status} />
        </div>

        <Tabs defaultValue={recruitData.data.status === '동행완료' ? '리포트' : '도우미'}>
          <Tabs.TabsList withHeader>
            {recruitData.data.status !== '동행완료' ? (
              <Tabs.TabsTrigger value='도우미'>도우미</Tabs.TabsTrigger>
            ) : (
              <Tabs.TabsTrigger value='리포트'>리포트</Tabs.TabsTrigger>
            )}
            <Tabs.TabsTrigger value='신청 내역'>신청 내역</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='도우미'>
            <ErrorSuspenseBoundary isRoot={false}>
              <HelperTab status={recruitData.data.status} />
            </ErrorSuspenseBoundary>
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
    </>
  );
}
