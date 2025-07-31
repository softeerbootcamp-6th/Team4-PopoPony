import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/$escortId/helper')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/$escortId/helper"!</div>;
}
