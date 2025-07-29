import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/escort/$escortId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/helper/escort/$escortId/"!</div>;
}
