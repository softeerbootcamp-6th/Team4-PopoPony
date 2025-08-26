import type { QueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { RecruitRegisterFormPage } from '@pages/customer/recruit-register-form';

import { recruitStepSearchSchema } from '@customer/types';

export const Route = createFileRoute('/customer/recruit/$step')({
  validateSearch: recruitStepSearchSchema,
  beforeLoad: async ({ search, context }) => {
    const { place } = search;
    const { queryClient } = context as { queryClient: QueryClient };

    if (place && !(place === 'meeting' || place === 'hospital' || place === 'return')) {
      throw redirect({
        to: '/customer',
      });
    }
    const started = queryClient.getQueryData<boolean>(['recruitFormStarted']);
    if (!started) {
      throw redirect({
        to: '/customer/recruit/$step',
        params: { step: 'profile' },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitRegisterFormPage />;
}
