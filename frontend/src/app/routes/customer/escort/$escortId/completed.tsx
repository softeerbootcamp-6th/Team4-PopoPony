import { createFileRoute } from '@tanstack/react-router';

import { RecruitCompletePage } from '@pages/customer/recruit-complete';

export const Route = createFileRoute('/customer/escort/$escortId/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitCompletePage />;
}
