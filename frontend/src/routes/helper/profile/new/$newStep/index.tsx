import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/helper/profile/new/$newStep/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/helper/profile/new/$newStep/"!</div>;
}
