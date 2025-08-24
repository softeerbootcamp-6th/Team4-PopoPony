import { recruitStepSearchSchema } from '@customer/types';
import { RecruitRegisterFormPage } from '@pages/customer/recruit-register-form';
import { createFileRoute, redirect } from '@tanstack/react-router';

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
