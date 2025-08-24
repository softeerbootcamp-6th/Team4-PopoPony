import { createFileRoute, redirect } from '@tanstack/react-router';

import { RecruitRegisterFormPage } from '@pages/customer/recruit-register-form';

import { recruitStepSearchSchema } from '@customer/types';

export const Route = createFileRoute('/customer/recruit/$step')({
  validateSearch: recruitStepSearchSchema,
  beforeLoad: async ({ search }) => {
    const { place } = search;
    if (place && !(place === 'meeting' || place === 'hospital' || place === 'return')) {
      throw redirect({
        to: '/customer',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitRegisterFormPage />;
}
