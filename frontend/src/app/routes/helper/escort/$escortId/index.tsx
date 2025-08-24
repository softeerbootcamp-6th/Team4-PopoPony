import { RecruitHistoryDetailPage } from '@pages/helper/recruit-history-detail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/escort/$escortId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitHistoryDetailPage />;
}
