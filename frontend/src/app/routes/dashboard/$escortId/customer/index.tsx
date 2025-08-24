import { createFileRoute, redirect } from '@tanstack/react-router';

import { CustomerDashboardPage } from '@pages/dashboard/customer';

import { $api } from '@shared/api';

export const Route = createFileRoute('/dashboard/$escortId/customer/')({
  beforeLoad: async ({ context, params }) => {
    const { queryClient } = context;
    const recruitId = Number(params.escortId);

    const escortDetailOpts = $api.queryOptions('get', '/api/escorts/recruits/{recruitId}', {
      params: { path: { recruitId } },
    });

    const escortDetail = await queryClient.ensureQueryData(escortDetailOpts);

    if (escortDetail.data.escortStatus === '동행준비') {
      throw redirect({
        to: '/dashboard/$escortId/customer/prepare',
        params: { escortId: String(recruitId) },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerDashboardPage />;
}
