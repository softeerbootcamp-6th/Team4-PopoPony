import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/helper/profile/"!</div>;
}
