import { RecruitPaymentPage } from '@pages/customer/recruit-payment';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/customer/escort/$escortId/payment/$applicationId')({
  component: RouteComponent,
});

function RouteComponent() {
  <RecruitPaymentPage />;
}
