import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/$escortId/customer/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/$escortId/customer"!</div>;
}
