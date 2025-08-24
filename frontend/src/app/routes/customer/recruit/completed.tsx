import { RecruitRegisterCompletePage } from '@pages/customer/recruit-register-complete';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/recruit/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitRegisterCompletePage />;
}
