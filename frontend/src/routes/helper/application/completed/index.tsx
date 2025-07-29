import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/application/completed/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/helper/application/completed/"!</div>;
}
