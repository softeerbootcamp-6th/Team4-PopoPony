import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/escort/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/helper/escort/"!</div>;
}
