import { createFileRoute } from '@tanstack/react-router';

import { HelperReviewCompletePage } from '@pages/customer/helper-review-complete';

export const Route = createFileRoute('/customer/escort/$escortId/$helperId/review/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperReviewCompletePage />;
}
