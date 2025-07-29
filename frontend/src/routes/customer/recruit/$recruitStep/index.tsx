import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/recruit/$recruitStep/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/customer/recruit/$step/"!</div>;
}
