import { type QueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { HelperReviewRegisterPage } from '@pages/customer/helper-review-register';

export const Route = createFileRoute('/customer/escort/$escortId/$helperId/review/$step')({
  component: RouteComponent,
  beforeLoad: async ({ params, context }) => {
    const { step, escortId, helperId } = params;
    const { queryClient } = context as { queryClient: QueryClient };
    if (step !== 'summary') {
      const started = queryClient.getQueryData<boolean>(['reviewFormStarted']);
      if (!started) {
        throw redirect({
          to: '/customer/escort/$escortId/$helperId/review/$step',
          params: { escortId, helperId, step: 'summary' },
        });
      }
    }
  },
});

function RouteComponent() {
  return <HelperReviewRegisterPage />;
}
