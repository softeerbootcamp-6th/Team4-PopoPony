import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/escort/$escortId/report/$reportStep')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/helper/escort/$escortId/report/$reportStep"!</div>;
}
