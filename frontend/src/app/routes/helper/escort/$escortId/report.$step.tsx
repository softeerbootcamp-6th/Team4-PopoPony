import type { QueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { ReportRegisterPage } from '@pages/helper/report-register';

export const Route = createFileRoute('/helper/escort/$escortId/report/$step')({
  component: RouteComponent,
  beforeLoad: async ({ params, context }) => {
    const { step, escortId } = params;
    const { queryClient } = context as { queryClient: QueryClient };
    if (step !== 'time') {
      const started = queryClient.getQueryData<boolean>(['reportFormStarted', escortId]);
      if (!started) {
        throw redirect({
          to: '/helper/escort/$escortId/report/$step',
          params: { escortId, step: 'time' },
        });
      }
    }
  },
});

function RouteComponent() {
  return <ReportRegisterPage />;
}
