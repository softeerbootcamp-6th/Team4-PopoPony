import { createFileRoute, redirect } from '@tanstack/react-router';
import { getEscortDetail } from '@dashboard/apis';
import { PageLayout } from '@layouts';
import { type EscortStatus } from '@types';
import { type EscortDetailResponse } from '@dashboard/types';
import { $api } from '@apis';

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
  const { escortId: recruitId } = Route.useParams();
  const { data: escortDetailOrigin } = getEscortDetail(Number(recruitId));
  const { escortId, escortDate, escortStatus, estimatedMeetingTime, estimatedReturnTime, route } =
    escortDetailOrigin.data;

  return (
    <PageLayout>
      <div></div>
    </PageLayout>
  );
}
