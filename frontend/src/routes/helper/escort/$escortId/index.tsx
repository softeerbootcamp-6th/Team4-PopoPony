import { createFileRoute, redirect, useParams } from '@tanstack/react-router';

import { RecruitCard } from '@widgets/ui';

import { ProgressIndicator } from '@entities/recruit/ui';

import { $api } from '@shared/api';
import { dateFormat, timeFormat } from '@shared/lib';
import { validateRecruitExistsByRecruitId } from '@shared/lib';
import { Spinner, Tabs } from '@shared/ui';
import { PageLayout } from '@shared/ui/layout';

import { getRecruitById } from '@helper/apis';
import { DetailTab, ReportTab } from '@helper/components';
import type { RecruitDetailResponse } from '@helper/types';

export const Route = createFileRoute('/helper/escort/$escortId/')({
  beforeLoad: async ({ context, params }) => {
    const escortId = Number(params.escortId);
    await validateRecruitExistsByRecruitId(escortId);
    const { queryClient } = context;
    const options = $api.queryOptions(
      'get',
      '/api/reports/recruits/{recruitId}',
      { params: { path: { recruitId: escortId } } },
      { throwOnError: false }
    );

    try {
      const report = await queryClient.ensureQueryData(options);
      const hasReport = Boolean(report?.data && report.data.reportId !== 0);
      if (!hasReport) {
        throw redirect({
          to: '/helper/escort/$escortId/report/$step',
          params: { escortId: params.escortId, step: 'time' },
        });
      }
    } catch {
      throw redirect({
        to: '/helper/escort/$escortId/report/$step',
        params: { escortId: params.escortId, step: 'time' },
      });
    }
  },
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
  // const navigate = useNavigate();
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
}
