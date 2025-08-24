import { createFileRoute } from '@tanstack/react-router';
import { HelperPrepareDashboardPage } from '@pages/dashboard/helper-prepare';

export const Route = createFileRoute('/dashboard/$escortId/helper/prepare')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelperPrepareDashboardPage />;
}
