import { EscortCard, ProgressIndicator, Tabs, Spinner } from '@components';
import { DetailTab, ReportTab } from '@helper/components';
import { PageLayout } from '@layouts';
import { createFileRoute, useParams, redirect } from '@tanstack/react-router';
import type { RecruitDetailResponse } from '@helper/types';
import { getRecruitById } from '@helper/apis';
import { dateFormat, timeFormat } from '@utils';
import { $api, NotFoundError } from '@apis';

export const Route = createFileRoute('/helper/escort/$escortId/')({
  beforeLoad: async ({ context, params }) => {
    const { queryClient } = context;
    const escortId = Number(params.escortId);
    const existsOptions = $api.queryOptions(
      'get',
      '/api/recruits/{recruitId}/status',
      { params: { path: { recruitId: escortId } } },
      { throwOnError: true, staleTime: 30_000, gcTime: 300_000 }
    );

    // 존재하지 않는 리소스(404)는 즉시 상위 에러 핸들링으로 위임
    try {
      await queryClient.ensureQueryData(existsOptions);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw err;
      }
      // 기타 오류는 아래 리포트 분기로 처리
    }
    const options = $api.queryOptions(
      'get',
      '/api/reports/recruits/{recruitId}',
      { params: { path: { recruitId: escortId } } },
      { throwOnError: false, staleTime: 30_000, gcTime: 300_000 }
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
          <Tabs.TabsList>
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
