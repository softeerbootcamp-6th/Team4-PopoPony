import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/$escortId/map')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/$escortId/map"!</div>;
}
