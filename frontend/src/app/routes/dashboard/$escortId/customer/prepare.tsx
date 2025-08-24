import { CustomerPrepareDashboardPage } from '@pages/dashboard/customer-prepare';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/dashboard/$escortId/customer/prepare')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerPrepareDashboardPage />;
}
