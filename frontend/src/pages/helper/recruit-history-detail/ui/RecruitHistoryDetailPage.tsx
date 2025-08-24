import { EscortCard, ProgressIndicator, Tabs, Spinner } from '@components';
import { DetailTab, ReportTab } from '@helper/components';
import { PageLayout } from '@layouts';
import { useParams } from '@tanstack/react-router';
import type { RecruitDetailResponse } from '@helper/types';
import { getRecruitById } from '@helper/apis';
import { dateFormat, timeFormat } from '@utils';

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

const RecruitHistoryDetailPage = () => {
  const { escortId } = useParams({ from: '/helper/escort/$escortId/' });
  const { data: recruitData, isLoading } = getRecruitById(Number(escortId));

  if (isLoading) {
    return (
      <div className='flex-center h-full w-full'>
        <Spinner size='48' color='primary' isLoading={true} />
      </div>
    );
  }
  if (!recruitData || !recruitData.data) {
    return null;
  }
  const { statusText, cardTitle, cardTimeText, cardLocationText } = refineCardData(
    recruitData.data
  );

  return (
    <>
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
        <Tabs defaultValue='리포트'>
          <Tabs.TabsList withHeader>
            <Tabs.TabsTrigger value='리포트'>리포트</Tabs.TabsTrigger>
            <Tabs.TabsTrigger value='지원 내역'>지원 내역</Tabs.TabsTrigger>
          </Tabs.TabsList>
          <Tabs.TabsContent value='리포트'>
            <ReportTab />
          </Tabs.TabsContent>
          <Tabs.TabsContent value='지원 내역'>
            <DetailTab data={recruitData.data} />
          </Tabs.TabsContent>
        </Tabs>
      </PageLayout.Content>
    </>
  );
};

export default RecruitHistoryDetailPage;
