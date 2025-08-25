import { createFileRoute } from '@tanstack/react-router';

import { RecruitCompletePage } from '@pages/helper/recruit-complete';

export const Route = createFileRoute('/helper/application/$escortId/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitCompletePage />;
}
