import { createFileRoute } from '@tanstack/react-router';

import { RecruitDetailPage } from '@pages/helper/recruit-detail';

export const Route = createFileRoute('/helper/application/$escortId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitDetailPage />;
}
