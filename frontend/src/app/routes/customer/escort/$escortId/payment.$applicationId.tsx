import { createFileRoute } from '@tanstack/react-router';

import { RecruitPaymentPage } from '@pages/customer/recruit-payment';

export const Route = createFileRoute('/customer/escort/$escortId/payment/$applicationId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitPaymentPage />;
}
