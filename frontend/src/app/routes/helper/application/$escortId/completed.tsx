import { RecruitCompletePage } from '@pages/helper/recruit-complete';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/application/$escortId/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitCompletePage />;
}
