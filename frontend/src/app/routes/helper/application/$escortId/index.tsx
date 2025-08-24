import { RecruitDetailPage } from '@pages/helper/recruit-detail';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/helper/application/$escortId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitDetailPage />;
}
