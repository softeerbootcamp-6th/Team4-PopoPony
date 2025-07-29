import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/application/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/helper/application/"!</div>;
}
