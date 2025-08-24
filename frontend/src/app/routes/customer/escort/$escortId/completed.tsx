import { RecruitCompletePage } from '@pages/customer/recruit-complete';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/customer/escort/$escortId/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitCompletePage />;
}
