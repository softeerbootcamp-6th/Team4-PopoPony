import { createFileRoute } from '@tanstack/react-router';

import { ReportCompletePage } from '@pages/helper/report-complete';

export const Route = createFileRoute('/helper/escort/$escortId/report/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReportCompletePage />;
}
