import { RecruitDetailPage } from '@pages/customer/recruit-detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitDetailPage />;
}
