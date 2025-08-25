import { createFileRoute } from '@tanstack/react-router';

import { RecruitRegisterCompletePage } from '@pages/customer/recruit-register-complete';

export const Route = createFileRoute('/customer/recruit/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitRegisterCompletePage />;
}
