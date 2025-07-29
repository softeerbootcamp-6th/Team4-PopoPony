import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customer/escort/$escortId/review/$reviewStep/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/customer/escort/$escortId/review/$reviewStep/"!</div>;
}
