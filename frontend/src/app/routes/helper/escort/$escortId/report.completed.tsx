import { ReportCompletePage } from '@pages/helper/report-complete';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/escort/$escortId/report/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReportCompletePage />;
}
