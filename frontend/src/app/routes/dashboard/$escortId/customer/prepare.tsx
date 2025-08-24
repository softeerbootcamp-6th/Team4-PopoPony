import { createFileRoute } from '@tanstack/react-router';

import { CustomerPrepareDashboardPage } from '@pages/dashboard/customer-prepare';

export const Route = createFileRoute('/dashboard/$escortId/customer/prepare')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerPrepareDashboardPage />;
}
