import { createFileRoute } from '@tanstack/react-router';

import { CustomerHomePage } from '@pages/customer/customer-home';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerHomePage />;
}
