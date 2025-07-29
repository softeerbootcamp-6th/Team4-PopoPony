import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/helper/"!</div>;
}
