import { createFileRoute } from '@tanstack/react-router';

import { RecruitHistoryDetailPage } from '@pages/helper/recruit-history-detail';

export const Route = createFileRoute('/helper/escort/$escortId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RecruitHistoryDetailPage />;
}
