import { createFileRoute } from '@tanstack/react-router';

import { RecruitDetailPage } from '@pages/customer/recruit-detail';

export const Route = createFileRoute('/customer/escort/$escortId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitDetailPage />;
}
