import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/helper/$helperId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/customer/escort/$escortId/helper/$helperId"!</div>;
}
