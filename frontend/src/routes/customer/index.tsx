import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/customer/"!</div>;
}
