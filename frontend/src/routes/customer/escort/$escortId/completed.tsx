import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/completed')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/customer/escort/$escortId/completed"!</div>;
}
