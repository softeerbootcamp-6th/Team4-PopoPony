import { createFileRoute, redirect } from '@tanstack/react-router';

import { RecruitHistoryDetailPage } from '@pages/helper/recruit-history-detail';

import { $api } from '@shared/api';
import { validateRecruitExistsByRecruitId } from '@shared/lib';

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

function RouteComponent() {
  return <RecruitHistoryDetailPage />;
}
