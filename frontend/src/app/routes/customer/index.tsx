import { CustomerHomePage } from '@pages/customer/customer-home';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerHomePage />;
}
