import { createFileRoute } from '@tanstack/react-router';
import { HelperReviewRegisterPage } from '@pages/customer/helper-review-register';

export const Route = createFileRoute('/customer/escort/$escortId/$helperId/review/$step')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperReviewRegisterPage />;
}
