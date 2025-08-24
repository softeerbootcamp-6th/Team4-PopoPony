import { createFileRoute, redirect } from '@tanstack/react-router';
import { $api } from '@shared/apis';
import { HelperDashboardPage } from '@pages/dashboard/helper';

export const Route = createFileRoute('/dashboard/$escortId/helper/')({
  beforeLoad: async ({ context, params }) => {
    const { queryClient } = context;
    const recruitId = Number(params.escortId);

    const escortDetailOpts = $api.queryOptions('get', '/api/escorts/recruits/{recruitId}', {
      params: { path: { recruitId } },
    });

    const escortDetail = await queryClient.ensureQueryData(escortDetailOpts);

    if (escortDetail.data.escortStatus === '동행준비') {
      throw redirect({
        to: '/dashboard/$escortId/helper/prepare',
        params: { escortId: String(recruitId) },
      });
    }
    if (escortDetail.data.escortStatus === '리포트작성중') {
      throw redirect({
        to: '/helper/escort/$escortId/report/$step',
        params: {
          escortId: String(recruitId),
          step: 'time',
        },
      });
    }
    if (escortDetail.data.escortStatus === '동행완료') {
      throw redirect({
        to: '/helper/escort/$escortId',
        params: {
          escortId: String(recruitId),
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperDashboardPage />;
}
