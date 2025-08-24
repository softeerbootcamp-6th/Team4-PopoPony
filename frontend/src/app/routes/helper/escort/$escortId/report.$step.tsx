import { createFileRoute } from '@tanstack/react-router';

import { ReportRegisterPage } from '@pages/helper/report-register';

export const Route = createFileRoute('/helper/escort/$escortId/report/$step')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReportRegisterPage />;
}
