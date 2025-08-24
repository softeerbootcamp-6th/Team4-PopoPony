import { ReportRegisterPage } from '@pages/helper/report-register';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/escort/$escortId/report/$step')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReportRegisterPage />;
}
